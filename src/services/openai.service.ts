import { Configuration, OpenAIApi } from 'openai';

export class OpenAIService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  // Generate text completion using GPT-4
  async createCompletion(prompt: string, options: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  } = {}): Promise<string> {
    try {
      const { temperature = 0.7, maxTokens = 1000, model = 'gpt-4' } = options;
      
      const response = await this.openai.createChatCompletion({
        model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant specialized in marketing and content creation.' },
          { role: 'user', content: prompt }
        ],
        temperature,
        max_tokens: maxTokens,
      });

      return response.data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating OpenAI completion:', error);
      throw new Error('Failed to generate AI content');
    }
  }

  // Generate image based on prompt
  async createImage(prompt: string, options: {
    size?: '256x256' | '512x512' | '1024x1024';
    n?: number;
  } = {}): Promise<string[]> {
    try {
      const { size = '1024x1024', n = 1 } = options;
      
      const response = await this.openai.createImage({
        prompt,
        n,
        size,
      });

      return response.data.data.map(item => item.url || '');
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate image');
    }
  }

  // Humanize AI-generated text to make it more natural
  async humanizeText(text: string): Promise<string> {
    const prompt = `
      Please rewrite the following text to make it sound more natural, engaging, and human-written.
      Maintain the same information, tone, and intent, but make it less robotic and more conversational.
      
      Text to humanize:
      "${text}"
    `;

    return this.createCompletion(prompt, { temperature: 0.8 });
  }

  // Generate social media hashtags
  async generateHashtags(topic: string, platform: string, count: number = 5): Promise<string[]> {
    const prompt = `
      Generate ${count} relevant and trending hashtags for a ${platform} post about ${topic}.
      The hashtags should be effective for increasing reach and engagement.
      Return only the hashtags as a comma-separated list without explanation.
    `;

    const result = await this.createCompletion(prompt, { temperature: 0.7 });
    return result.split(',').map(tag => tag.trim());
  }

  // Generate content ideas based on topic and platform
  async generateContentIdeas(topic: string, platform: string, count: number = 5): Promise<string[]> {
    const prompt = `
      Generate ${count} creative content ideas for ${platform} about ${topic}.
      Each idea should be engaging and optimized for the platform.
      Return each idea as a bullet point without additional explanation.
    `;

    const result = await this.createCompletion(prompt, { temperature: 0.9 });
    return result
      .split('\n')
      .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
      .filter(line => line.length > 0);
  }

  // Analyze content sentiment and tone
  async analyzeContent(text: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    tone: string[];
    readability: string;
    suggestions: string[];
  }> {
    const prompt = `
      Analyze the following content and provide:
      1. Overall sentiment (positive, neutral, or negative)
      2. Tone descriptors (list 2-3)
      3. Readability assessment
      4. Brief suggestions for improvement
      
      Content to analyze:
      "${text}"
      
      Format your response as JSON with the following structure:
      {
        "sentiment": "positive|neutral|negative",
        "tone": ["descriptor1", "descriptor2"],
        "readability": "assessment",
        "suggestions": ["suggestion1", "suggestion2"]
      }
    `;

    const result = await this.createCompletion(prompt);
    try {
      return JSON.parse(result);
    } catch (e) {
      console.error('Failed to parse JSON from OpenAI response:', result);
      return {
        sentiment: 'neutral',
        tone: ['unclear'],
        readability: 'Unable to assess',
        suggestions: ['Analysis failed, please try again']
      };
    }
  }

  // Summarize analytics data in natural language
  async summarizeAnalytics(data: any): Promise<string> {
    const dataString = JSON.stringify(data);
    const prompt = `
      Summarize the following analytics data in 2-3 sentences that highlight the most important insights.
      Focus on trends, significant changes, and actionable insights.
      
      Analytics data:
      ${dataString}
    `;

    return this.createCompletion(prompt);
  }
} 