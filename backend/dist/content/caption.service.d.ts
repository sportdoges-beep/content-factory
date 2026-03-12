import { ConfigService } from '@nestjs/config';
export declare class CaptionService {
    private configService;
    private readonly openaiApiKey;
    constructor(configService: ConfigService);
    generateCaption(originalCaption: string, options?: {
        includeHashtags?: boolean;
        style?: 'funny' | 'professional' | 'viral' | 'short';
        language?: 'en' | 'ru';
    }): Promise<{
        caption: string;
        hashtags: string[];
    }>;
    private generateWithAI;
    private buildPrompt;
    private parseAIResponse;
    private generateSimple;
    generateHashtags(content: string, count?: number): string[];
    private extractKeywords;
}
