import { PrismaClient } from '@prisma/client';
import { OpenAIService } from './openai.service';
import { ContentService } from './content.service';

const prisma = new PrismaClient();
const openai = new OpenAIService();
const contentService = new ContentService();

export interface CampaignCreateData {
  name: string;
  description?: string;
  objective: string;
  startDate: Date;
  endDate: Date;
  budget?: number;
  targetAudience?: string;
  platforms: string[];
  tags?: string[];
  createdById: string;
  organizationId?: string;
}

export interface CampaignUpdateData {
  name?: string;
  description?: string;
  objective?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  targetAudience?: string;
  platforms?: string[];
  tags?: string[];
  status?: string;
}

export class CampaignService {
  // Create a new campaign
  async createCampaign(data: CampaignCreateData) {
    // Create campaign in database
    const campaign = await prisma.campaign.create({
      data: {
        name: data.name,
        description: data.description || '',
        objective: data.objective,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
        targetAudience: data.targetAudience,
        platforms: data.platforms,
        tags: data.tags || [],
        status: 'DRAFT',
        createdById: data.createdById,
        organizationId: data.organizationId,
      },
    });
    
    return campaign;
  }

  // Get campaign by ID
  async getCampaignById(campaignId: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            type: true,
            platform: true,
            status: true,
            scheduledFor: true,
            publishedAt: true,
            analytics: true,
          },
        },
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
    
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    return campaign;
  }

  // Get campaigns for user or organization
  async getCampaignList(params: {
    userId: string;
    organizationId?: string;
    status?: string[];
    page?: number;
    limit?: number;
    search?: string;
    startDate?: Date;
    endDate?: Date;
    platforms?: string[];
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
    
    if (params.status && params.status.length > 0) {
      where.status = { in: params.status };
    }
    
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    
    if (params.startDate) {
      where.startDate = { gte: params.startDate };
    }
    
    if (params.endDate) {
      where.endDate = { lte: params.endDate };
    }
    
    if (params.platforms && params.platforms.length > 0) {
      where.platforms = { hasSome: params.platforms };
    }
    
    const [items, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          _count: {
            select: { content: true },
          },
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
      prisma.campaign.count({ where }),
    ]);
    
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Update campaign
  async updateCampaign(campaignId: string, userId: string, data: CampaignUpdateData) {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        createdById: userId,
      },
    });
    
    if (!campaign) {
      throw new Error('Campaign not found or access denied');
    }
    
    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    
    return updatedCampaign;
  }

  // Delete campaign
  async deleteCampaign(campaignId: string, userId: string) {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        createdById: userId,
      },
      include: {
        content: true,
      },
    });
    
    if (!campaign) {
      throw new Error('Campaign not found or access denied');
    }
    
    // Check if campaign has published content
    const hasPublishedContent = campaign.content.some(
      content => content.status === 'PUBLISHED'
    );
    
    if (hasPublishedContent) {
      throw new Error('Cannot delete campaign with published content');
    }
    
    // Delete all content in the campaign
    await prisma.content.deleteMany({
      where: { campaignId },
    });
    
    // Delete campaign
    await prisma.campaign.delete({
      where: { id: campaignId },
    });
    
    return { success: true };
  }

  // Archive campaign
  async archiveCampaign(campaignId: string, userId: string) {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        createdById: userId,
      },
    });
    
    if (!campaign) {
      throw new Error('Campaign not found or access denied');
    }
    
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: 'ARCHIVED',
        updatedAt: new Date(),
      },
    });
    
    return { success: true };
  }

  // Launch campaign
  async launchCampaign(campaignId: string, userId: string) {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        createdById: userId,
      },
      include: {
        content: true,
      },
    });
    
    if (!campaign) {
      throw new Error('Campaign not found or access denied');
    }
    
    if (campaign.status !== 'DRAFT') {
      throw new Error('Only draft campaigns can be launched');
    }
    
    // Validate campaign
    if (!campaign.name || !campaign.objective) {
      throw new Error('Campaign name and objective are required');
    }
    
    if (campaign.startDate > campaign.endDate) {
      throw new Error('End date must be after start date');
    }
    
    if (campaign.platforms.length === 0) {
      throw new Error('At least one platform must be selected');
    }
    
    // Update campaign status
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: 'ACTIVE',
        updatedAt: new Date(),
      },
    });
    
    return { success: true };
  }

  // Generate campaign ideas with AI
  async generateCampaignIdeas(params: {
    userId: string;
    industry: string;
    objective: string;
    targetAudience?: string;
    platforms?: string[];
    productName?: string;
    count?: number;
  }) {
    const count = params.count || 3;
    
    let prompt = `Generate ${count} creative marketing campaign ideas for a ${params.industry} business. `;
    prompt += `The main objective is to ${params.objective}. `;
    
    if (params.targetAudience) {
      prompt += `The target audience is ${params.targetAudience}. `;
    }
    
    if (params.platforms && params.platforms.length > 0) {
      prompt += `The campaign will run on the following platforms: ${params.platforms.join(', ')}. `;
    }
    
    if (params.productName) {
      prompt += `The product/service name is "${params.productName}". `;
    }
    
    prompt += `
For each campaign idea, provide:
1. A catchy campaign name
2. A brief description (2-3 sentences)
3. The primary platforms it would run on
4. 2-3 content ideas for the campaign
5. Expected outcomes

Format as JSON like this:
[
  {
    "name": "Campaign Name",
    "description": "Campaign description...",
    "platforms": ["Platform1", "Platform2"],
    "contentIdeas": ["Idea 1", "Idea 2", "Idea 3"],
    "expectedOutcomes": ["Outcome 1", "Outcome 2"]
  }
]`;
    
    const result = await openai.createCompletion(prompt);
    
    try {
      // Parse the JSON response
      const ideas = JSON.parse(result);
      return ideas;
    } catch (error) {
      console.error('Failed to parse JSON from AI response:', error);
      // Return a fallback response
      return [
        {
          name: 'AI-Generated Campaign',
          description: 'The AI generated some ideas but they could not be parsed correctly. Please try again.',
          platforms: params.platforms || ['FACEBOOK', 'INSTAGRAM'],
          contentIdeas: ['Social media posts', 'Email newsletter', 'Blog article'],
          expectedOutcomes: ['Increased brand awareness', 'Higher engagement']
        }
      ];
    }
  }

  // Create content for a campaign
  async createCampaignContent(params: {
    campaignId: string;
    userId: string;
    contentType: string;
    platform: string;
    topic: string;
    tone?: string;
    count?: number;
  }) {
    // Get the campaign
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: params.campaignId,
        createdById: params.userId,
      },
    });
    
    if (!campaign) {
      throw new Error('Campaign not found or access denied');
    }
    
    const count = params.count || 1;
    const results = [];
    
    // Generate content for the campaign
    for (let i = 0; i < count; i++) {
      const generated = await contentService.generateContent({
        userId: params.userId,
        type: params.contentType,
        platform: params.platform,
        topic: params.topic,
        tone: params.tone || 'professional',
        audience: campaign.targetAudience,
      });
      
      // Create content in database
      const content = await contentService.createContent({
        title: generated.title,
        text: generated.text,
        type: params.contentType,
        platform: params.platform,
        campaignId: params.campaignId,
        createdById: params.userId,
        organizationId: campaign.organizationId,
        tags: campaign.tags,
      });
      
      results.push(content);
    }
    
    return results;
  }

  // Get campaign analytics
  async getCampaignAnalytics(campaignId: string, userId: string) {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        createdById: userId,
      },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            type: true,
            platform: true,
            status: true,
            publishedAt: true,
            analytics: true,
          },
        },
      },
    });
    
    if (!campaign) {
      throw new Error('Campaign not found or access denied');
    }
    
    // Get published content only
    const publishedContent = campaign.content.filter(c => c.status === 'PUBLISHED');
    
    // Aggregate analytics by platform
    const platformMetrics: Record<string, any> = {};
    
    publishedContent.forEach(content => {
      const platform = content.platform || 'other';
      
      if (!platformMetrics[platform]) {
        platformMetrics[platform] = {
          contentCount: 0,
          impressions: 0,
          engagements: 0,
          clicks: 0,
          conversions: 0,
        };
      }
      
      const metrics = content.analytics?.metrics || {};
      
      platformMetrics[platform].contentCount++;
      platformMetrics[platform].impressions += metrics.impressions || 0;
      platformMetrics[platform].engagements += 
        (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
      platformMetrics[platform].clicks += metrics.clicks || 0;
      platformMetrics[platform].conversions += metrics.conversions || 0;
    });
    
    // Calculate overall metrics
    const totalImpressions = Object.values(platformMetrics).reduce(
      (sum: number, platform: any) => sum + platform.impressions, 0
    );
    
    const totalEngagements = Object.values(platformMetrics).reduce(
      (sum: number, platform: any) => sum + platform.engagements, 0
    );
    
    const totalClicks = Object.values(platformMetrics).reduce(
      (sum: number, platform: any) => sum + platform.clicks, 0
    );
    
    const totalConversions = Object.values(platformMetrics).reduce(
      (sum: number, platform: any) => sum + platform.conversions, 0
    );
    
    // Calculate ROI if budget is set
    let roi = null;
    if (campaign.budget && campaign.budget > 0) {
      // This is a simplified ROI calculation
      // In a real implementation, you would calculate actual revenue generated
      const estimatedRevenue = totalConversions * 100; // Assuming $100 per conversion
      roi = (estimatedRevenue - campaign.budget) / campaign.budget * 100;
    }
    
    // Top performing content
    const topContent = [...publishedContent]
      .sort((a, b) => {
        const engagementA = this.calculateEngagement(a.analytics?.metrics || {});
        const engagementB = this.calculateEngagement(b.analytics?.metrics || {});
        return engagementB - engagementA;
      })
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        title: c.title,
        platform: c.platform,
        type: c.type,
        metrics: c.analytics?.metrics || {},
      }));
    
    return {
      overview: {
        contentCount: publishedContent.length,
        totalImpressions,
        totalEngagements,
        totalClicks,
        totalConversions,
        engagementRate: totalImpressions > 0 ? (totalEngagements / totalImpressions * 100).toFixed(2) + '%' : '0%',
        clickThroughRate: totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) + '%' : '0%',
        conversionRate: totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) + '%' : '0%',
        roi: roi !== null ? roi.toFixed(2) + '%' : 'N/A',
      },
      platformBreakdown: platformMetrics,
      topContent,
      // In a real implementation, you would include time-based metrics as well
    };
  }

  // Helper to calculate engagement
  private calculateEngagement(metrics: any): number {
    return (
      (metrics.likes || 0) * 1 +
      (metrics.comments || 0) * 2 +
      (metrics.shares || 0) * 3 +
      (metrics.clicks || 0) * 1
    );
  }
} 