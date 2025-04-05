import { PrismaClient } from '@prisma/client';
import { ContentService } from './content.service';
import cron from 'node-cron';

const prisma = new PrismaClient();
const contentService = new ContentService();

interface ScheduledJob {
  id: string;
  cronExpression: string;
  task: () => Promise<void>;
  description: string;
}

export class SchedulerService {
  private activeJobs: Map<string, cron.ScheduledTask> = new Map();
  private isInitialized: boolean = false;

  // Initialize the scheduler and load all jobs
  async initialize() {
    if (this.isInitialized) return;
    
    console.log('Initializing scheduler service...');
    
    // Set up recurring system jobs
    this.setupSystemJobs();
    
    // Load user-scheduled content jobs
    await this.loadScheduledContentJobs();
    
    this.isInitialized = true;
    console.log(`Scheduler initialized with ${this.activeJobs.size} jobs`);
  }

  // Set up system jobs that run on a regular basis
  private setupSystemJobs() {
    // Job to process scheduled content (runs every 5 minutes)
    this.scheduleJob({
      id: 'system:process-scheduled-content',
      cronExpression: '*/5 * * * *',
      task: async () => {
        console.log('Running scheduled job: process-scheduled-content');
        await contentService.processScheduledContent();
      },
      description: 'Process content scheduled for publishing',
    });
    
    // Job to check for integration tokens that need refreshing (runs daily)
    this.scheduleJob({
      id: 'system:refresh-integration-tokens',
      cronExpression: '0 0 * * *',
      task: async () => {
        console.log('Running scheduled job: refresh-integration-tokens');
        await this.refreshIntegrationTokens();
      },
      description: 'Refresh integration OAuth tokens',
    });
    
    // Job to clean up expired sessions (runs daily)
    this.scheduleJob({
      id: 'system:cleanup-sessions',
      cronExpression: '0 2 * * *',
      task: async () => {
        console.log('Running scheduled job: cleanup-sessions');
        await this.cleanupExpiredSessions();
      },
      description: 'Clean up expired sessions',
    });
  }

  // Load all scheduled content jobs from the database
  private async loadScheduledContentJobs() {
    // Get all content that is scheduled
    const scheduledContent = await prisma.content.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledFor: {
          gt: new Date(),
        },
      },
    });
    
    console.log(`Found ${scheduledContent.length} scheduled content items to load`);
    
    // Schedule a job for each content item
    for (const content of scheduledContent) {
      if (!content.scheduledFor) continue;
      
      // Convert the scheduledFor date to a cron expression
      const date = new Date(content.scheduledFor);
      const cronExpression = this.dateToCronExpression(date);
      
      // Schedule the job
      this.scheduleJob({
        id: `content:${content.id}`,
        cronExpression,
        task: async () => {
          console.log(`Publishing scheduled content: ${content.id}`);
          try {
            await contentService.publishContent(content.id, content.createdById);
          } catch (error) {
            console.error('Failed to publish content:', error);
          }
        },
        description: `Publish content: ${content.title}`,
      });
    }
  }

  // Schedule a one-time content publication
  async scheduleContentPublication(contentId: string, userId: string, publishAt: Date) {
    const content = await prisma.content.findFirst({
      where: {
        id: contentId,
        createdById: userId,
      },
    });
    
    if (!content) {
      throw new Error('Content not found or access denied');
    }
    
    if (publishAt <= new Date()) {
      throw new Error('Scheduled time must be in the future');
    }
    
    // Update content in database
    await contentService.scheduleContent(contentId, userId, publishAt);
    
    // Create a cron expression from the date
    const cronExpression = this.dateToCronExpression(publishAt);
    
    // Schedule the job
    this.scheduleJob({
      id: `content:${contentId}`,
      cronExpression,
      task: async () => {
        console.log(`Publishing scheduled content: ${contentId}`);
        try {
          await contentService.publishContent(contentId, userId);
        } catch (error) {
          console.error('Failed to publish content:', error);
        }
      },
      description: `Publish content: ${content.title}`,
    });
    
    return { success: true, scheduledFor: publishAt };
  }

  // Cancel a scheduled content publication
  async cancelScheduledPublication(contentId: string, userId: string) {
    const content = await prisma.content.findFirst({
      where: {
        id: contentId,
        createdById: userId,
        status: 'SCHEDULED',
      },
    });
    
    if (!content) {
      throw new Error('Scheduled content not found or access denied');
    }
    
    // Cancel the job
    this.cancelJob(`content:${contentId}`);
    
    // Update content status back to APPROVED or DRAFT
    await prisma.content.update({
      where: { id: contentId },
      data: {
        status: content.publishedAt ? 'APPROVED' : 'DRAFT',
        scheduledFor: null,
        updatedAt: new Date(),
      },
    });
    
    return { success: true };
  }

  // Reschedule a content publication
  async rescheduleContentPublication(contentId: string, userId: string, newPublishAt: Date) {
    // Cancel the existing job
    await this.cancelScheduledPublication(contentId, userId);
    
    // Schedule a new job
    return this.scheduleContentPublication(contentId, userId, newPublishAt);
  }

  // Get all scheduled jobs for a user
  async getScheduledContentForUser(userId: string) {
    const scheduledContent = await prisma.content.findMany({
      where: {
        createdById: userId,
        status: 'SCHEDULED',
        scheduledFor: {
          gt: new Date(),
        },
      },
      orderBy: {
        scheduledFor: 'asc',
      },
      select: {
        id: true,
        title: true,
        type: true,
        platform: true,
        scheduledFor: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return scheduledContent;
  }

  // Schedule a recurring job
  async scheduleRecurringJob(params: {
    userId: string;
    name: string;
    cronExpression: string;
    contentGenerationParams: {
      type: string;
      platform: string;
      topic: string;
      tone?: string;
    };
    organizationId?: string;
  }) {
    // Validate cron expression
    if (!cron.validate(params.cronExpression)) {
      throw new Error('Invalid cron expression');
    }
    
    // Create recurring job in database
    const job = await prisma.recurringJob.create({
      data: {
        name: params.name,
        cronExpression: params.cronExpression,
        contentGenerationParams: params.contentGenerationParams,
        status: 'ACTIVE',
        createdById: params.userId,
        organizationId: params.organizationId,
      },
    });
    
    // Schedule the job
    this.scheduleJob({
      id: `recurring:${job.id}`,
      cronExpression: params.cronExpression,
      task: async () => {
        console.log(`Running recurring job: ${job.name}`);
        try {
          // Generate content with AI
          const generated = await contentService.generateContent({
            userId: params.userId,
            type: params.contentGenerationParams.type,
            platform: params.contentGenerationParams.platform,
            topic: params.contentGenerationParams.topic,
            tone: params.contentGenerationParams.tone,
          });
          
          // Create content in database
          await contentService.createContent({
            title: generated.title,
            text: generated.text,
            type: params.contentGenerationParams.type,
            platform: params.contentGenerationParams.platform,
            createdById: params.userId,
            organizationId: params.organizationId,
            status: 'DRAFT', // Start as draft so it can be reviewed
          });
          
          // Update job last run time
          await prisma.recurringJob.update({
            where: { id: job.id },
            data: {
              lastRunAt: new Date(),
              updatedAt: new Date(),
            },
          });
        } catch (error) {
          console.error('Failed to run recurring job:', error);
          
          // Update job error count
          await prisma.recurringJob.update({
            where: { id: job.id },
            data: {
              errorCount: { increment: 1 },
              lastError: (error as Error).message,
              updatedAt: new Date(),
            },
          });
        }
      },
      description: `Recurring job: ${params.name}`,
    });
    
    return job;
  }

  // Cancel a recurring job
  async cancelRecurringJob(jobId: string, userId: string) {
    const job = await prisma.recurringJob.findFirst({
      where: {
        id: jobId,
        createdById: userId,
      },
    });
    
    if (!job) {
      throw new Error('Recurring job not found or access denied');
    }
    
    // Cancel the job
    this.cancelJob(`recurring:${jobId}`);
    
    // Update job status
    await prisma.recurringJob.update({
      where: { id: jobId },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      },
    });
    
    return { success: true };
  }

  // Update a recurring job
  async updateRecurringJob(
    jobId: string,
    userId: string,
    updates: {
      name?: string;
      cronExpression?: string;
      contentGenerationParams?: {
        type?: string;
        platform?: string;
        topic?: string;
        tone?: string;
      };
      status?: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
    }
  ) {
    const job = await prisma.recurringJob.findFirst({
      where: {
        id: jobId,
        createdById: userId,
      },
    });
    
    if (!job) {
      throw new Error('Recurring job not found or access denied');
    }
    
    // If changing the cron expression, validate it
    if (updates.cronExpression && !cron.validate(updates.cronExpression)) {
      throw new Error('Invalid cron expression');
    }
    
    // If changing the status to active or paused
    if (updates.status) {
      if (updates.status === 'ACTIVE' && job.status !== 'ACTIVE') {
        // Reschedule the job
        const cronExpression = updates.cronExpression || job.cronExpression;
        this.scheduleJob({
          id: `recurring:${jobId}`,
          cronExpression,
          task: async () => {
            console.log(`Running recurring job: ${job.name}`);
            try {
              // This is simplified - in a real implementation, you would
              // use the updated content generation params
              const contentParams = {
                ...job.contentGenerationParams,
                ...updates.contentGenerationParams,
              };
              
              // Generate content with AI
              const generated = await contentService.generateContent({
                userId: job.createdById,
                type: contentParams.type,
                platform: contentParams.platform,
                topic: contentParams.topic,
                tone: contentParams.tone,
              });
              
              // Create content in database
              await contentService.createContent({
                title: generated.title,
                text: generated.text,
                type: contentParams.type,
                platform: contentParams.platform,
                createdById: job.createdById,
                organizationId: job.organizationId,
                status: 'DRAFT',
              });
              
              // Update job last run time
              await prisma.recurringJob.update({
                where: { id: job.id },
                data: {
                  lastRunAt: new Date(),
                  updatedAt: new Date(),
                },
              });
            } catch (error) {
              console.error('Failed to run recurring job:', error);
              
              // Update job error count
              await prisma.recurringJob.update({
                where: { id: job.id },
                data: {
                  errorCount: { increment: 1 },
                  lastError: (error as Error).message,
                  updatedAt: new Date(),
                },
              });
            }
          },
          description: `Recurring job: ${updates.name || job.name}`,
        });
      } else if (updates.status === 'PAUSED' || updates.status === 'CANCELLED') {
        // Cancel the job
        this.cancelJob(`recurring:${jobId}`);
      }
    }
    
    // Update job in database
    const updatedJob = await prisma.recurringJob.update({
      where: { id: jobId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });
    
    return updatedJob;
  }

  // Helper to convert a Date to a cron expression
  private dateToCronExpression(date: Date): string {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const dayOfWeek = date.getDay();
    
    return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
  }

  // Helper to schedule a job
  private scheduleJob(job: ScheduledJob): void {
    // Cancel any existing job with the same ID
    this.cancelJob(job.id);
    
    // Schedule the new job
    const scheduledTask = cron.schedule(job.cronExpression, async () => {
      try {
        await job.task();
      } catch (error) {
        console.error(`Error running job ${job.id}:`, error);
      }
    });
    
    // Store the job
    this.activeJobs.set(job.id, scheduledTask);
    
    console.log(`Scheduled job: ${job.id} with cron: ${job.cronExpression}`);
  }

  // Helper to cancel a job
  private cancelJob(jobId: string): void {
    const job = this.activeJobs.get(jobId);
    if (job) {
      job.stop();
      this.activeJobs.delete(jobId);
      console.log(`Cancelled job: ${jobId}`);
    }
  }

  // System job to refresh integration tokens
  private async refreshIntegrationTokens(): Promise<void> {
    // Get integrations with tokens that expire within the next 24 hours
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    
    const integrations = await prisma.integration.findMany({
      where: {
        config: {
          path: ['expiresAt'],
          lt: tomorrow.toISOString(),
        },
        status: 'ACTIVE',
      },
    });
    
    console.log(`Found ${integrations.length} integrations that need token refresh`);
    
    // Process each integration
    for (const integration of integrations) {
      try {
        // In a real implementation, this would call the integration service
        // to refresh the token
        
        // For demo purposes, mark as processed with a random new expiry
        const newExpiryDate = new Date();
        newExpiryDate.setHours(newExpiryDate.getHours() + Math.floor(Math.random() * 168) + 24); // 1-7 days
        
        // Update the integration with a new token expiry
        await prisma.integration.update({
          where: { id: integration.id },
          data: {
            config: {
              ...integration.config,
              expiresAt: newExpiryDate.toISOString(),
            },
            updatedAt: new Date(),
          },
        });
        
        console.log(`Refreshed token for integration: ${integration.id}`);
      } catch (error) {
        console.error(`Failed to refresh token for integration ${integration.id}:`, error);
        
        // Update integration status if refresh failed
        await prisma.integration.update({
          where: { id: integration.id },
          data: {
            status: 'FAILED',
            updatedAt: new Date(),
          },
        });
      }
    }
  }

  // System job to clean up expired sessions
  private async cleanupExpiredSessions(): Promise<void> {
    const now = new Date();
    
    // Delete expired sessions
    const result = await prisma.session.deleteMany({
      where: {
        expires: {
          lt: now,
        },
      },
    });
    
    console.log(`Cleaned up ${result.count} expired sessions`);
  }
} 