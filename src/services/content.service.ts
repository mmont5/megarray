import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ContentCreateData {
  text?: string;
  mediaUrl?: string;
  type: string;
  platform: string;
}

export interface ContentUpdateData {
  text?: string;
  mediaUrl?: string;
  type?: string;
  platform?: string;
}

export class ContentService {
  // Create new content
  async createContent(data: ContentCreateData) {
    // Create content in database
    const content = await prisma.content.create({
      data: {
        text: data.text || '',
        mediaUrl: data.mediaUrl,
        type: data.type as any,
        platform: data.platform as any
      },
    });
    
    return content;
  }

  // Get content by ID
  async getContentById(contentId: string) {
    const content = await prisma.content.findUnique({
      where: { id: contentId }
    });
    
    if (!content) {
      throw new Error('Content not found');
    }
    
    return content;
  }

  // Get content list
  async getContentList(params: {
    type?: string[];
    platform?: string[];
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (params.type && params.type.length > 0) {
      where.type = { in: params.type };
    }
    
    if (params.platform && params.platform.length > 0) {
      where.platform = { in: params.platform };
    }
    
    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        orderBy: { createdAt: 'desc' },
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
  async updateContent(contentId: string, data: ContentUpdateData) {
    const content = await prisma.content.findUnique({
      where: { id: contentId }
    });
    
    if (!content) {
      throw new Error('Content not found');
    }
    
    const updatedContent = await prisma.content.update({
      where: { id: contentId },
      data: {
        ...data,
        type: data.type as any,
        platform: data.platform as any
      }
    });
    
    return updatedContent;
  }

  // Delete content
  async deleteContent(contentId: string) {
    const content = await prisma.content.findUnique({
      where: { id: contentId }
    });
    
    if (!content) {
      throw new Error('Content not found');
    }
    
    await prisma.content.delete({
      where: { id: contentId }
    });
  }
} 