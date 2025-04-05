import { PrismaClient } from '@prisma/client';
import { OpenAIService } from './openai.service';

const prisma = new PrismaClient();
const openai = new OpenAIService();

export class AnalyticsService {
  // Get content analytics across all platforms
  async getContentAnalytics(params: {
    userId: string;
    organizationId?: string;
    startDate: Date;
    endDate: Date;
    platforms?: string[];
    contentTypes?: string[];
  }) {
    // Build the query
    const query: any = {
      where: {
        createdById: params.userId,
        publishedAt: {
          gte: params.startDate,
          lte: params.endDate
        },
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        type: true,
        platform: true,
        publishedAt: true,
        analytics: true
      }
    };
    
    // Add organization filter if provided
    if (params.organizationId) {
      query.where.organizationId = params.organizationId;
    }
    
    // Add platform filter if provided
    if (params.platforms && params.platforms.length > 0) {
      query.where.platform = { in: params.platforms };
    }
    
    // Add content type filter if provided
    if (params.contentTypes && params.contentTypes.length > 0) {
      query.where.type = { in: params.contentTypes };
    }
    
    // Get the content with analytics
    const content = await prisma.content.findMany(query);
    
    // Process and aggregate the data
    const aggregatedData = this.aggregateAnalytics(content);
    
    // Generate summary with AI
    const summary = await openai.summarizeAnalytics(aggregatedData);
    
    return {
      summary,
      aggregatedData,
      content
    };
  }
  
  // Get analytics for a specific content item
  async getSingleContentAnalytics(contentId: string) {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      select: {
        id: true,
        title: true,
        type: true,
        platform: true,
        publishedAt: true,
        publishedUrl: true,
        analytics: true
      }
    });
    
    if (!content) {
      throw new Error('Content not found');
    }
    
    // In a real implementation, this would fetch the latest analytics
    // from the relevant platform APIs
    
    // For demo purposes, generate random metrics if none exist
    if (!content.analytics) {
      const randomMetrics = this.generateRandomMetrics(content.type as string);
      
      // Update the content with the new metrics
      await prisma.content.update({
        where: { id: contentId },
        data: { analytics: randomMetrics }
      });
      
      return { ...content, analytics: randomMetrics };
    }
    
    return content;
  }
  
  // Generate heatmap data for email or webpage
  async getHeatmapData(contentId: string, type: 'email' | 'webpage') {
    // In a real implementation, this would fetch heatmap data from a service
    // like Hotjar, Crazy Egg, etc.
    
    // For demo purposes, generate random heatmap data
    const width = type === 'email' ? 600 : 1200;
    const height = type === 'email' ? 800 : 3000;
    
    const heatmapPoints = [];
    // Generate 500 random points with varying intensity
    for (let i = 0; i < 500; i++) {
      heatmapPoints.push({
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        value: Math.random() // Intensity between 0 and 1
      });
    }
    
    return {
      contentId,
      type,
      dimensions: { width, height },
      points: heatmapPoints,
      maxClicks: Math.max(...heatmapPoints.map(p => p.value)),
      avgFoldLine: Math.floor(height * 0.4) // Approximate "fold" line
    };
  }
  
  // Get funnel analytics
  async getFunnelAnalytics(params: {
    userId: string;
    organizationId?: string;
    funnelId?: string;
    startDate: Date;
    endDate: Date;
  }) {
    // In a real implementation, this would fetch data from GA4, Meta Pixel,
    // or other analytics sources to build funnel visualization
    
    // For demo purposes, generate a sample funnel
    const funnelStages = [
      { name: 'Page View', count: 10000 },
      { name: 'Click CTA', count: 2500 },
      { name: 'Form View', count: 1800 },
      { name: 'Form Submit', count: 750 },
      { name: 'Purchase', count: 320 }
    ];
    
    // Calculate conversion rates between stages
    const funnelWithRates = funnelStages.map((stage, index) => {
      if (index === 0) return { ...stage, conversionRate: '100%' };
      
      const previousStage = funnelStages[index - 1];
      const conversionRate = ((stage.count / previousStage.count) * 100).toFixed(2) + '%';
      
      return { ...stage, conversionRate };
    });
    
    // Generate breakdown by source
    const sources = ['Organic Search', 'Direct', 'Social Media', 'Email', 'Referral'];
    const sourceBreakdown = sources.map(source => ({
      source,
      metrics: {
        visitors: Math.floor(Math.random() * 5000),
        conversions: Math.floor(Math.random() * 200),
        conversionRate: (Math.random() * 10).toFixed(2) + '%'
      }
    }));
    
    return {
      funnelStages: funnelWithRates,
      sourceBreakdown,
      topPerformingPages: [
        { path: '/features', conversions: 127 },
        { path: '/pricing', conversions: 85 },
        { path: '/blog/social-media-tips', conversions: 43 }
      ],
      conversionTrend: this.generateDailyTrend(params.startDate, params.endDate)
    };
  }
  
  // Get email campaign analytics
  async getEmailAnalytics(params: {
    userId: string;
    organizationId?: string;
    campaignId?: string;
    startDate: Date;
    endDate: Date;
  }) {
    // In a real implementation, this would fetch data from email
    // service providers like Mailchimp, SendGrid, etc.
    
    // For demo purposes, generate sample email analytics
    return {
      deliveryMetrics: {
        sent: 5000,
        delivered: 4950,
        bounced: 50,
        bounceRate: '1.0%'
      },
      engagementMetrics: {
        opens: 1485,
        openRate: '30.0%',
        clicks: 372,
        clickRate: '7.5%',
        clickToOpenRate: '25.1%'
      },
      conversionMetrics: {
        conversions: 45,
        conversionRate: '0.9%',
        revenue: '$2,250',
        revenuePerEmail: '$0.45'
      },
      unsubscribes: {
        count: 15,
        rate: '0.3%'
      },
      emailClients: [
        { client: 'Gmail', percentage: '45%' },
        { client: 'Apple Mail', percentage: '25%' },
        { client: 'Outlook', percentage: '15%' },
        { client: 'Yahoo Mail', percentage: '10%' },
        { client: 'Other', percentage: '5%' }
      ],
      deviceBreakdown: [
        { device: 'Mobile', percentage: '55%' },
        { device: 'Desktop', percentage: '40%' },
        { device: 'Tablet', percentage: '5%' }
      ],
      timeSeries: this.generateEmailTimeSeries(params.startDate, params.endDate)
    };
  }
  
  // Helper method to aggregate analytics data
  private aggregateAnalytics(content: any[]) {
    // Group content by platform
    const byPlatform: Record<string, any[]> = {};
    content.forEach(item => {
      const platform = item.platform || 'unknown';
      if (!byPlatform[platform]) {
        byPlatform[platform] = [];
      }
      byPlatform[platform].push(item);
    });
    
    // Calculate platform totals
    const platformTotals: Record<string, any> = {};
    for (const [platform, items] of Object.entries(byPlatform)) {
      const totalEngagement = items.reduce((sum, item) => {
        const analytics = item.analytics || {};
        return sum + (
          (analytics.likes || 0) +
          (analytics.shares || 0) +
          (analytics.comments || 0) +
          (analytics.clicks || 0)
        );
      }, 0);
      
      platformTotals[platform] = {
        contentCount: items.length,
        totalEngagement,
        avgEngagement: totalEngagement / items.length
      };
    }
    
    // Find best performing content
    const sortedByEngagement = [...content].sort((a, b) => {
      const engagementA = this.calculateTotalEngagement(a.analytics || {});
      const engagementB = this.calculateTotalEngagement(b.analytics || {});
      return engagementB - engagementA;
    });
    
    const topPerforming = sortedByEngagement.slice(0, 5);
    
    return {
      totalContent: content.length,
      byPlatform: platformTotals,
      topPerforming,
      // Time-based analysis would be added here
    };
  }
  
  // Helper to calculate total engagement from analytics
  private calculateTotalEngagement(analytics: any): number {
    return (
      (analytics.likes || 0) +
      (analytics.shares || 0) * 2 + // Shares weighted more
      (analytics.comments || 0) * 3 + // Comments weighted even more
      (analytics.clicks || 0)
    );
  }
  
  // Helper to generate random metrics for demo purposes
  private generateRandomMetrics(contentType: string): any {
    const baseMetrics = {
      views: Math.floor(Math.random() * 10000),
      likes: Math.floor(Math.random() * 500),
      shares: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
      clicks: Math.floor(Math.random() * 300),
      clickThroughRate: (Math.random() * 5).toFixed(2) + '%'
    };
    
    // Add type-specific metrics
    switch (contentType) {
      case 'VIDEO':
        return {
          ...baseMetrics,
          watchTime: Math.floor(Math.random() * 5000) + ' minutes',
          avgWatchDuration: Math.floor(Math.random() * 120) + ' seconds',
          completionRate: (Math.random() * 70).toFixed(2) + '%'
        };
      case 'EMAIL':
        return {
          opens: Math.floor(Math.random() * 3000),
          openRate: (Math.random() * 40).toFixed(2) + '%',
          clicks: Math.floor(Math.random() * 500),
          clickRate: (Math.random() * 15).toFixed(2) + '%',
          unsubscribes: Math.floor(Math.random() * 20)
        };
      case 'AD':
        return {
          impressions: Math.floor(Math.random() * 50000),
          clicks: Math.floor(Math.random() * 1000),
          ctr: (Math.random() * 5).toFixed(2) + '%',
          costPerClick: '$' + (Math.random() * 2).toFixed(2),
          spend: '$' + Math.floor(Math.random() * 500),
          conversions: Math.floor(Math.random() * 50)
        };
      default:
        return baseMetrics;
    }
  }
  
  // Generate daily trend data for time series charts
  private generateDailyTrend(startDate: Date, endDate: Date): any[] {
    const trend = [];
    const currentDate = new Date(startDate);
    const endDateTime = endDate.getTime();
    
    while (currentDate.getTime() <= endDateTime) {
      trend.push({
        date: new Date(currentDate).toISOString().split('T')[0],
        value: Math.floor(Math.random() * 100)
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return trend;
  }
  
  // Generate email time series data
  private generateEmailTimeSeries(startDate: Date, endDate: Date): any[] {
    const series = [];
    const currentDate = new Date(startDate);
    const endDateTime = endDate.getTime();
    
    while (currentDate.getTime() <= endDateTime) {
      const opens = Math.floor(Math.random() * 500);
      const clicks = Math.floor(Math.random() * (opens * 0.3)); // Clicks always less than opens
      
      series.push({
        date: new Date(currentDate).toISOString().split('T')[0],
        opens,
        clicks,
        unsubscribes: Math.floor(Math.random() * 5)
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return series;
  }
} 