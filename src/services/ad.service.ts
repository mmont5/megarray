import { PrismaClient, Content, ContentType, SocialPlatform } from '@prisma/client';
import { OpenAIService } from './openai.service';

const prisma = new PrismaClient();
const openai = new OpenAIService();

export class AdService {
  // Create new ad from scratch or convert existing content
  async createAd(adData: {
    title: string;
    text: string;
    mediaUrls?: string[];
    platform: SocialPlatform;
    campaignId?: string;
    budget: number;
    currency: string;
    targetAudience: {
      locations: string[];
      interests?: string[];
      ageRange?: { min: number; max: number };
      gender?: string;
    };
    duration: { startDate: Date; endDate: Date };
    createdById: string;
    organizationId?: string;
    contentId?: string; // If converting existing content
  }) {
    // If converting from existing content, fetch it first
    let sourceContent = null;
    if (adData.contentId) {
      sourceContent = await prisma.content.findUnique({
        where: { id: adData.contentId }
      });
      
      if (!sourceContent) {
        throw new Error('Source content not found');
      }
    }
    
    // Create the ad content
    const adContent = await prisma.content.create({
      data: {
        title: adData.title,
        text: adData.text || (sourceContent?.text || ''),
        mediaUrls: adData.mediaUrls || (sourceContent?.mediaUrls || []),
        type: ContentType.AD,
        platform: adData.platform,
        status: 'DRAFT',
        createdById: adData.createdById,
        organizationId: adData.organizationId,
        campaignId: adData.campaignId,
        analytics: {
          budget: adData.budget,
          currency: adData.currency,
          targetAudience: adData.targetAudience,
          duration: adData.duration,
          metrics: {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            spend: 0
          }
        }
      },
    });
    
    // Create initial version
    await prisma.contentVersion.create({
      data: {
        contentId: adContent.id,
        version: 1,
        text: adContent.text || '',
        mediaUrls: adContent.mediaUrls || [],
      },
    });
    
    return adContent;
  }

  // Generate ad copy with AI
  async generateAdCopy(params: {
    platform: SocialPlatform;
    product: string;
    targetAudience: string;
    objective: 'awareness' | 'consideration' | 'conversion';
    keyBenefits: string[];
    toneOfVoice?: string;
  }) {
    // Build prompt for the ad copy
    let prompt = `Create a compelling ad for ${params.platform} promoting ${params.product}. `;
    prompt += `The ad is targeting ${params.targetAudience} with the objective of ${params.objective}. `;
    prompt += `Key benefits to highlight: ${params.keyBenefits.join(', ')}. `;
    
    if (params.toneOfVoice) {
      prompt += `Use a ${params.toneOfVoice} tone of voice. `;
    }
    
    // Add platform-specific instructions
    switch (params.platform) {
      case 'FACEBOOK':
      case 'INSTAGRAM':
        prompt += 'Create a headline (max 40 chars), primary text (max 125 chars), and a call to action.';
        break;
      case 'TWITTER':
        prompt += 'Create an engaging tweet (max 280 chars) with a strong call to action.';
        break;
      case 'LINKEDIN':
        prompt += 'Create a professional headline, descriptive copy, and a business-oriented call to action.';
        break;
      default:
        prompt += 'Create a headline, descriptive copy, and a clear call to action.';
    }
    
    // Get completion from OpenAI
    const adCopy = await openai.createCompletion(prompt);
    
    return {
      adCopy,
      platform: params.platform,
      targetAudience: params.targetAudience,
      objective: params.objective
    };
  }

  // Launch ad campaign
  async launchAd(adId: string) {
    const ad = await prisma.content.findUnique({
      where: { id: adId, type: ContentType.AD }
    });
    
    if (!ad) {
      throw new Error('Ad not found');
    }
    
    if (!ad.analytics) {
      throw new Error('Ad does not have required metrics and targeting information');
    }
    
    // In a real implementation, this would:
    // 1. Connect to the appropriate ad platform API (Facebook, Google, etc.)
    // 2. Create and launch the ad campaign
    // 3. Store the campaign ID and other relevant information
    // 4. Start tracking performance
    
    // For demo purposes:
    const mockCampaignId = `campaign_${Math.random().toString(36).substring(2, 10)}`;
    
    // Update ad status
    await prisma.content.update({
      where: { id: adId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        publishedUrl: `https://ad-platform.com/ads/${mockCampaignId}`,
        analytics: {
          ...ad.analytics,
          externalId: mockCampaignId,
          status: 'ACTIVE',
          launchedAt: new Date()
        }
      }
    });
    
    return { success: true, campaignId: mockCampaignId };
  }

  // Get ad performance metrics
  async getAdMetrics(adId: string) {
    const ad = await prisma.content.findUnique({
      where: { id: adId, type: ContentType.AD }
    });
    
    if (!ad) {
      throw new Error('Ad not found');
    }
    
    // In a real implementation, this would:
    // 1. Connect to the ad platform API
    // 2. Fetch the latest performance metrics
    // 3. Update the local analytics data
    
    // For demo purposes, generate random metrics:
    const metrics = {
      impressions: Math.floor(Math.random() * 10000),
      clicks: Math.floor(Math.random() * 500),
      ctr: (Math.random() * 5).toFixed(2) + '%',
      conversions: Math.floor(Math.random() * 50),
      costPerClick: (Math.random() * 2).toFixed(2),
      spend: (Math.random() * ad.analytics.budget).toFixed(2),
      roi: (Math.random() * 400).toFixed(2) + '%'
    };
    
    // Update ad with latest metrics
    await prisma.content.update({
      where: { id: adId },
      data: {
        analytics: {
          ...ad.analytics,
          metrics
        }
      }
    });
    
    return metrics;
  }

  // Pause or resume an ad
  async toggleAdStatus(adId: string, action: 'pause' | 'resume') {
    const ad = await prisma.content.findUnique({
      where: { id: adId, type: ContentType.AD }
    });
    
    if (!ad) {
      throw new Error('Ad not found');
    }
    
    // In a real implementation, this would call the ad platform API
    // to pause or resume the campaign
    
    // Update local status
    await prisma.content.update({
      where: { id: adId },
      data: {
        status: action === 'pause' ? 'DRAFT' : 'PUBLISHED',
        analytics: {
          ...ad.analytics,
          status: action === 'pause' ? 'PAUSED' : 'ACTIVE',
          lastStatusChange: new Date()
        }
      }
    });
    
    return { success: true, status: action === 'pause' ? 'PAUSED' : 'ACTIVE' };
  }

  // Get ad recommendations based on performance
  async getAdRecommendations(adId: string) {
    const ad = await prisma.content.findUnique({
      where: { id: adId, type: ContentType.AD },
      include: {
        campaign: {
          include: {
            content: {
              where: {
                type: ContentType.AD,
                id: { not: adId }
              }
            }
          }
        }
      }
    });
    
    if (!ad) {
      throw new Error('Ad not found');
    }
    
    // In a real implementation, this would analyze performance data
    // and provide actionable recommendations
    
    // For demo purposes:
    return {
      performance: ad.analytics.metrics.ctr > 2 ? 'Good' : 'Needs improvement',
      recommendations: [
        'Consider increasing budget to reach more users',
        'Test different visuals to improve engagement',
        'Narrow targeting to increase relevance',
        'Update call-to-action to improve conversion rate'
      ],
      bestPerformingTime: '7:45pm - 9:30pm',
      suggestedAudiences: [
        'Urban professionals aged 25-34',
        'Tech enthusiasts in metropolitan areas'
      ]
    };
  }
} 