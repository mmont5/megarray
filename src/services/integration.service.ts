import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Define integration platform types
export type IntegrationType = 
  'SOCIAL' | 'ANALYTICS' | 'EMAIL' | 'CRM' | 'PAYMENT' | 'AI' | 'OTHER';

export type IntegrationStatus = 'ACTIVE' | 'PAUSED' | 'FAILED' | 'EXPIRED';

export interface IntegrationConfig {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  endpoint?: string;
  scope?: string[];
  settings?: Record<string, any>;
  [key: string]: any;
}

export class IntegrationService {
  // Add a new integration
  async addIntegration(params: {
    userId: string;
    organizationId?: string;
    type: IntegrationType;
    name: string;
    config: IntegrationConfig;
  }) {
    // Encrypt sensitive information
    const encryptedConfig = this.encryptConfig(params.config);
    
    // Create integration in database
    const integration = await prisma.integration.create({
      data: {
        userId: params.userId,
        organizationId: params.organizationId,
        type: params.type,
        name: params.name,
        config: encryptedConfig,
        status: 'ACTIVE',
      },
    });
    
    // Return safe version without sensitive data
    return {
      id: integration.id,
      name: integration.name,
      type: integration.type,
      status: integration.status,
      createdAt: integration.createdAt,
      connected: true,
    };
  }

  // Get all integrations for a user or organization
  async getIntegrations(params: {
    userId: string;
    organizationId?: string;
    type?: IntegrationType;
  }) {
    const where: any = {
      userId: params.userId,
    };
    
    if (params.organizationId) {
      where.organizationId = params.organizationId;
    }
    
    if (params.type) {
      where.type = params.type;
    }
    
    const integrations = await prisma.integration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    // Return safe versions without sensitive data
    return integrations.map(integration => ({
      id: integration.id,
      name: integration.name,
      type: integration.type,
      status: integration.status,
      createdAt: integration.createdAt,
      connected: true,
      // Include a safe subset of the config
      platform: integration.config.platform,
      scope: integration.config.scope,
    }));
  }

  // Delete an integration
  async deleteIntegration(integrationId: string, userId: string) {
    const integration = await prisma.integration.findFirst({
      where: {
        id: integrationId,
        userId,
      },
    });
    
    if (!integration) {
      throw new Error('Integration not found or access denied');
    }
    
    await prisma.integration.delete({
      where: { id: integrationId },
    });
    
    return { success: true };
  }

  // Update integration status
  async updateIntegrationStatus(
    integrationId: string,
    userId: string,
    status: IntegrationStatus
  ) {
    const integration = await prisma.integration.findFirst({
      where: {
        id: integrationId,
        userId,
      },
    });
    
    if (!integration) {
      throw new Error('Integration not found or access denied');
    }
    
    await prisma.integration.update({
      where: { id: integrationId },
      data: { status },
    });
    
    return { success: true, status };
  }

  // Refresh access token for OAuth integrations
  async refreshOAuthToken(integrationId: string, userId: string) {
    const integration = await prisma.integration.findFirst({
      where: {
        id: integrationId,
        userId,
      },
    });
    
    if (!integration) {
      throw new Error('Integration not found or access denied');
    }
    
    // Decrypt the config to access current tokens
    const decryptedConfig = this.decryptConfig(integration.config);
    
    if (!decryptedConfig.refreshToken) {
      throw new Error('No refresh token available for this integration');
    }
    
    // In a real implementation, this would call the platform's API 
    // to refresh the token using the refresh token
    
    // For demo purposes, simulate a token refresh
    const newAccessToken = crypto.randomBytes(32).toString('hex');
    const newRefreshToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expires in 24 hours
    
    // Update the config with new tokens
    const updatedConfig = {
      ...decryptedConfig,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt: expiresAt.toISOString(),
    };
    
    // Encrypt the updated config
    const encryptedConfig = this.encryptConfig(updatedConfig);
    
    // Update the integration in the database
    await prisma.integration.update({
      where: { id: integrationId },
      data: {
        config: encryptedConfig,
        updatedAt: new Date(),
      },
    });
    
    return { success: true, expiresAt };
  }

  // Get integration details (including decrypted config) for internal use
  async getIntegrationDetails(integrationId: string, userId: string) {
    const integration = await prisma.integration.findFirst({
      where: {
        id: integrationId,
        userId,
      },
    });
    
    if (!integration) {
      throw new Error('Integration not found or access denied');
    }
    
    // Decrypt the config
    const decryptedConfig = this.decryptConfig(integration.config);
    
    return {
      ...integration,
      config: decryptedConfig,
    };
  }

  // Test integration connection
  async testIntegration(integrationId: string, userId: string) {
    const integration = await this.getIntegrationDetails(integrationId, userId);
    
    // In a real implementation, this would test the connection by
    // making a simple API call to the platform
    
    // For demo purposes, simulate a test
    const isSuccessful = Math.random() > 0.1; // 90% success rate
    
    if (!isSuccessful) {
      await this.updateIntegrationStatus(integrationId, userId, 'FAILED');
      throw new Error('Integration test failed. Please check your credentials.');
    }
    
    // Update last tested timestamp
    await prisma.integration.update({
      where: { id: integrationId },
      data: {
        status: 'ACTIVE',
        updatedAt: new Date(),
      },
    });
    
    return { success: true, status: 'ACTIVE' };
  }

  // Helper to encrypt sensitive config data
  private encryptConfig(config: IntegrationConfig): any {
    // In a real implementation, use proper encryption for sensitive data
    // For demo purposes, we'll just mark the data as "encrypted"
    const encryptedFields = ['apiKey', 'apiSecret', 'accessToken', 'refreshToken'];
    const encryptedConfig = { ...config };
    
    for (const field of encryptedFields) {
      if (encryptedConfig[field]) {
        // In production, use proper encryption like:
        // encryptedConfig[field] = encrypt(encryptedConfig[field], process.env.ENCRYPTION_KEY);
        encryptedConfig[field] = `encrypted:${encryptedConfig[field]}`;
      }
    }
    
    return encryptedConfig;
  }

  // Helper to decrypt sensitive config data
  private decryptConfig(encryptedConfig: any): IntegrationConfig {
    // In a real implementation, properly decrypt the sensitive data
    // For demo purposes, we'll just remove the "encrypted:" prefix
    const decryptedConfig = { ...encryptedConfig };
    const encryptedFields = ['apiKey', 'apiSecret', 'accessToken', 'refreshToken'];
    
    for (const field of encryptedFields) {
      if (decryptedConfig[field] && typeof decryptedConfig[field] === 'string' && 
          decryptedConfig[field].startsWith('encrypted:')) {
        // In production, use proper decryption like:
        // decryptedConfig[field] = decrypt(decryptedConfig[field], process.env.ENCRYPTION_KEY);
        decryptedConfig[field] = decryptedConfig[field].replace('encrypted:', '');
      }
    }
    
    return decryptedConfig;
  }

  // Get available integration types
  getAvailableIntegrations() {
    // This would typically be fetched from a database or config file
    // For demo purposes, we'll return a hardcoded list
    return [
      {
        type: 'SOCIAL',
        platforms: [
          { id: 'facebook', name: 'Facebook', oauthUrl: '/api/integrations/oauth/facebook' },
          { id: 'instagram', name: 'Instagram', oauthUrl: '/api/integrations/oauth/instagram' },
          { id: 'twitter', name: 'Twitter', oauthUrl: '/api/integrations/oauth/twitter' },
          { id: 'linkedin', name: 'LinkedIn', oauthUrl: '/api/integrations/oauth/linkedin' },
          { id: 'tiktok', name: 'TikTok', oauthUrl: '/api/integrations/oauth/tiktok' },
        ],
      },
      {
        type: 'ANALYTICS',
        platforms: [
          { id: 'google_analytics', name: 'Google Analytics', oauthUrl: '/api/integrations/oauth/google' },
          { id: 'meta_pixel', name: 'Meta Pixel', apiKeyRequired: true },
          { id: 'hotjar', name: 'Hotjar', apiKeyRequired: true },
        ],
      },
      {
        type: 'EMAIL',
        platforms: [
          { id: 'mailchimp', name: 'Mailchimp', apiKeyRequired: true },
          { id: 'sendgrid', name: 'SendGrid', apiKeyRequired: true },
          { id: 'klaviyo', name: 'Klaviyo', apiKeyRequired: true },
        ],
      },
      {
        type: 'CRM',
        platforms: [
          { id: 'salesforce', name: 'Salesforce', oauthUrl: '/api/integrations/oauth/salesforce' },
          { id: 'hubspot', name: 'HubSpot', oauthUrl: '/api/integrations/oauth/hubspot' },
          { id: 'zoho', name: 'Zoho CRM', apiKeyRequired: true },
        ],
      },
      {
        type: 'AI',
        platforms: [
          { id: 'openai', name: 'OpenAI', apiKeyRequired: true },
          { id: 'azure_openai', name: 'Azure OpenAI', apiKeyRequired: true },
          { id: 'anthropic', name: 'Anthropic Claude', apiKeyRequired: true },
        ],
      },
    ];
  }
} 