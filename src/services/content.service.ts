import { PrismaClient } from '@prisma/client';
import { OpenAIService } from './openai.service';

const prisma = new PrismaClient();
const openai = new OpenAIService();

export interface ContentCreateData {
  title: string;
  text?: string;
  mediaUrls?: string[];
  type: string;
  platform?: string;
  campaignId?: string;
  scheduledFor?: Date;
  createdById: string;
  organizationId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ContentUpdateData {
  title?: string;
  text?: string;
  mediaUrls?: string[];
  platform?: string;
  scheduledFor?: Date | null;
  status?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export class ContentService {
  // Create new content
  async createContent(data: ContentCreateData) {
    // Create content in database
    const content = await prisma.content.create({
      data: {
        title: data.title,
        text: data.text || '',
        mediaUrls: data.mediaUrls || [],
        type: data.type,
        platform: data.platform,
        status: 'DRAFT',
        campaignId: data.campaignId,
        createdById: data.createdById,
        organizationId: data.organizationId,
        tags: data.tags || [],
        metadata: data.metadata || {},
        scheduledFor: data.scheduledFor,
      },
    });
    
    // Create initial version
    await prisma.contentVersion.create({
      data: {
        contentId: content.id,
        version: 1,
        text: content.text || '',
        mediaUrls: content.mediaUrls || [],
        title: content.title,
      },
    });
    
    return content;
  }

  // Get content by ID
  async getContentById(contentId: string) {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
        campaign: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    
    if (!content) {
      throw new Error('Content not found');
    }
    
    return content;
  }

  // Get content for user or organization
  async getContentList(params: {
    userId: string;
    organizationId?: string;
    type?: string[];
    platform?: string[];
    status?: string[];
    page?: number;
    limit?: number;
    search?: string;
    campaignId?: string;
    scheduledFrom?: Date;
    scheduledTo?: Date;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;
    
    const where: any = {
      createdById: params.userId,
    };
    
    if (params.organizationId) {
      where.organizationId = params.organizationId;
    }
    
    if (params.type && params.type.length > 0) {
      where.type = { in: params.type };
    }
    
    if (params.platform && params.platform.length > 0) {
      where.platform = { in: params.platform };
    }
    
    if (params.status && params.status.length > 0) {
      where.status = { in: params.status };
    }
    
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { text: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    
    if (params.campaignId) {
      where.campaignId = params.campaignId;
    }
    
    if (params.scheduledFrom || params.scheduledTo) {
      where.scheduledFor = {};
      
      if (params.scheduledFrom) {
        where.scheduledFor.gte = params.scheduledFrom;
      }
      
      if (params.scheduledTo) {
        where.scheduledFor.lte = params.scheduledTo;
      }
    }
    
    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          campaign: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.content.count({ where }),
    ]);
    
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Update content
  async updateContent(contentId: string, userId: string, data: ContentUpdateData) {
    const content = await prisma.content.findFirst({
      where: {
        id: contentId,
        createdById: userId,
      },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
    });
    
    if (!content) {
      throw new Error('Content not found or access denied');
    }
    
    // Check if text or mediaUrls changed to create a new version
    const createNewVersion = 
      (data.text !== undefined && data.text !== content.text) ||
      (data.mediaUrls !== undefined && JSON.stringify(data.mediaUrls) !== JSON.stringify(content.mediaUrls));
    
    // Update content
    const updatedContent = await prisma.content.update({
      where: { id: contentId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    
    // Create new version if needed
    if (createNewVersion) {
      const latestVersion = content.versions[0];
      
      await prisma.contentVersion.create({
        data: {
          contentId,
          version: (latestVersion?.version || 0) + 1,
          text: data.text || content.text || '',
          mediaUrls: data.mediaUrls || content.mediaUrls || [],
          title: data.title || content.title,
        },
      });
    }
    
    return updatedContent;
  }

  // Delete content
  async deleteContent(contentId: string, userId: string) {
    const content = await prisma.content.findFirst({
      where: {
        id: contentId,
        createdById: userId,
      },
    });
    
    if (!content) {
      throw new Error('Content not found or access denied');
    }
    
    // Delete all versions
    await prisma.contentVersion.deleteMany({
      where: { contentId },
    });
    
    // Delete content
    await prisma.content.delete({
      where: { id: contentId },
    });
    
    return { success: true };
  }

  // Get content versions
  async getContentVersions(contentId: string, userId: string) {
    const content = await prisma.content.findFirst({
      where: {
        id: contentId,
        createdById: userId,
      },
    });
    
    if (!content) {
      throw new Error('Content not found or access denied');
    }
    
    const versions = await prisma.contentVersion.findMany({
      where: { contentId },
      orderBy: { version: 'desc' },
    });
    
    return versions;
  }

  // Submit content for approval
  async submitForApproval(contentId: string, userId: string, notes?: string) {
    const content = await prisma.content.findFirst({
      where: {
        id: contentId,
        createdById: userId,
      },
    });
    
    if (!content) {
      throw new Error('Content not found or access denied');
    }
    
    if (content.status !== 'DRAFT') {
      throw new Error('Only draft content can be submitted for approval');
    }
    
    // Create approval request
    await prisma.approvalRequest.create({
      data: {
        contentId,
        requestedById: userId,
        status: 'PENDING',
        notes: notes || '',
      },
    });
    
    // Update content status
    await prisma.content.update({
      where: { id: contentId },
      data: {
        status: 'PENDING_APPROVAL',
        updatedAt: new Date(),
      },
    });
    
    return { success: true };
  }

  // Approve or reject content
  async reviewContent(params: {
    contentId: string;
    reviewerId: string;
    approved: boolean;
    notes?: string;
  }) {
    const content = await prisma.content.findUnique({
      where: { id: params.contentId },
      include: {
        approvalRequests: {
          where: { status: 'PENDING' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    
    if (!content) {
      throw new Error('Content not found');
    }
    
    if (content.approvalRequests.length === 0) {
      throw new Error('No pending approval request found');
    }
    
    const requestId = content.approvalRequests[0].id;
    
    // Update approval request
    await prisma.approvalRequest.update({
      where: { id: requestId },
      data: {
        reviewerId: params.reviewerId,
        status: params.approved ? 'APPROVED' : 'REJECTED',
        reviewedAt: new Date(),
        notes: params.notes || '',
      },
    });
    
    // Update content status
    await prisma.content.update({
      where: { id: params.contentId },
      data: {
        status: params.approved ? 
          (content.scheduledFor && content.scheduledFor > new Date() ? 'SCHEDULED' : 'APPROVED') : 
          'REJECTED',
        updatedAt: new Date(),
      },
    });
    
    return { success: true };
  }

  // Generate content with AI
  async generateContent(params: {
    userId: string;
    type: string;
    platform?: string;
    title?: string;
    topic: string;
    tone?: string;
    length?: 'short' | 'medium' | 'long';
    audience?: string;
    keywords?: string[];
  }) {
    let prompt = `Create ${params.type.toLowerCase()} content about "${params.topic}". `;
    
    if (params.title) {
      prompt += `The title is "${params.title}". `;
    }
    
    if (params.platform) {
      prompt += `This is for ${params.platform}. `;
      
      // Add platform-specific instructions
      switch (params.platform) {
        case 'TWITTER':
          prompt += 'Keep it under 280 characters. ';
          break;
        case 'INSTAGRAM':
          prompt += 'Include 5-7 relevant hashtags at the end. ';
          break;
        case 'LINKEDIN':
          prompt += 'Use a professional tone with clear paragraphs. Include a call to action at the end. ';
          break;
        case 'FACEBOOK':
          prompt += 'Keep it engaging and conversational. Include a question to encourage engagement. ';
          break;
      }
    }
    
    if (params.tone) {
      prompt += `Use a ${params.tone} tone. `;
    }
    
    if (params.length) {
      switch (params.length) {
        case 'short':
          prompt += 'Keep it brief, around 1-2 paragraphs. ';
          break;
        case 'medium':
          prompt += 'Write a moderate length piece, around 3-4 paragraphs. ';
          break;
        case 'long':
          prompt += 'Create an in-depth piece with 5+ paragraphs. ';
          break;
      }
    }
    
    if (params.audience) {
      prompt += `The target audience is ${params.audience}. `;
    }
    
    if (params.keywords && params.keywords.length > 0) {
      prompt += `Try to naturally include these keywords: ${params.keywords.join(', ')}. `;
    }
    
    // Generate content with AI
    const generatedText = await openai.createCompletion(prompt);
    
    // Generate a title if not provided
    let generatedTitle = params.title;
    if (!generatedTitle) {
      const titlePrompt = `Generate a catchy title for this ${params.type.toLowerCase()} about ${params.topic}:
      
      ${generatedText.substring(0, 200)}...
      
      Title:`;
      
      generatedTitle = await openai.createCompletion(titlePrompt, { maxTokens: 50 });
    }
    
    return {
      title: generatedTitle,
      text: generatedText,
      type: params.type,
      platform: params.platform,
    };
  }

  // Schedule content for publishing
  async scheduleContent(contentId: string, userId: string, scheduledFor: Date) {
    const content = await prisma.content.findFirst({
      where: {
        id: contentId,
        createdById: userId,
      },
    });
    
    if (!content) {
      throw new Error('Content not found or access denied');
    }
    
    if (content.status !== 'DRAFT' && content.status !== 'APPROVED') {
      throw new Error('Only draft or approved content can be scheduled');
    }
    
    if (scheduledFor < new Date()) {
      throw new Error('Scheduled time must be in the future');
    }
    
    // Update content
    await prisma.content.update({
      where: { id: contentId },
      data: {
        scheduledFor,
        status: content.status === 'APPROVED' ? 'SCHEDULED' : content.status,
        updatedAt: new Date(),
      },
    });
    
    return { success: true, scheduledFor };
  }

  // Publish content immediately
  async publishContent(contentId: string, userId: string) {
    const content = await prisma.content.findFirst({
      where: {
        id: contentId,
        createdById: userId,
      },
    });
    
    if (!content) {
      throw new Error('Content not found or access denied');
    }
    
    if (content.status !== 'APPROVED' && content.status !== 'SCHEDULED') {
      throw new Error('Only approved or scheduled content can be published');
    }
    
    // In a real implementation, this would call the appropriate platform API
    // to publish the content
    
    // For demo purposes, generate a mock published URL
    let publishedUrl;
    if (content.platform) {
      const platform = content.platform.toLowerCase();
      const randomId = Math.random().toString(36).substring(2, 10);
      
      switch (platform) {
        case 'twitter':
          publishedUrl = `https://twitter.com/username/status/${randomId}`;
          break;
        case 'facebook':
          publishedUrl = `https://facebook.com/username/posts/${randomId}`;
          break;
        case 'instagram':
          publishedUrl = `https://instagram.com/p/${randomId}`;
          break;
        case 'linkedin':
          publishedUrl = `https://linkedin.com/posts/${randomId}`;
          break;
        default:
          publishedUrl = `https://${platform}.com/${randomId}`;
      }
    }
    
    // Update content
    await prisma.content.update({
      where: { id: contentId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        publishedUrl,
        updatedAt: new Date(),
      },
    });
    
    return { success: true, publishedUrl };
  }

  // System function: Process scheduled content for publishing
  async processScheduledContent() {
    const now = new Date();
    
    // Find all content that is scheduled and due to be published
    const scheduledContent = await prisma.content.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledFor: {
          lte: now,
        },
      },
    });
    
    // Process each item
    const results = await Promise.all(
      scheduledContent.map(async (content) => {
        try {
          // In a real implementation, this would call the appropriate platform API
          // to publish the content
          
          // For demo purposes, generate a mock published URL
          let publishedUrl;
          if (content.platform) {
            const platform = content.platform.toLowerCase();
            const randomId = Math.random().toString(36).substring(2, 10);
            
            switch (platform) {
              case 'twitter':
                publishedUrl = `https://twitter.com/username/status/${randomId}`;
                break;
              case 'facebook':
                publishedUrl = `https://facebook.com/username/posts/${randomId}`;
                break;
              case 'instagram':
                publishedUrl = `https://instagram.com/p/${randomId}`;
                break;
              case 'linkedin':
                publishedUrl = `https://linkedin.com/posts/${randomId}`;
                break;
              default:
                publishedUrl = `https://${platform}.com/${randomId}`;
            }
          }
          
          // Update content
          await prisma.content.update({
            where: { id: content.id },
            data: {
              status: 'PUBLISHED',
              publishedAt: now,
              publishedUrl,
              updatedAt: now,
            },
          });
          
          return { id: content.id, success: true };
        } catch (error) {
          console.error(`Failed to publish scheduled content ${content.id}:`, error);
          return { id: content.id, success: false, error: (error as Error).message };
        }
      })
    );
    
    return {
      processed: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      details: results,
    };
  }
} 