"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let CaptionService = class CaptionService {
    constructor(configService) {
        this.configService = configService;
        this.openaiApiKey = this.configService.get('OPENAI_API_KEY', '');
    }
    async generateCaption(originalCaption, options = {}) {
        const { includeHashtags = true, style = 'viral', language = 'en' } = options;
        if (this.openaiApiKey) {
            return this.generateWithAI(originalCaption, { includeHashtags, style, language });
        }
        return this.generateSimple(originalCaption, { includeHashtags, language });
    }
    async generateWithAI(originalCaption, options) {
        const prompt = this.buildPrompt(originalCaption, options);
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.openaiApiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 200,
                }),
            });
            const data = await response.json();
            const text = data.choices?.[0]?.message?.content || '';
            return this.parseAIResponse(text);
        }
        catch (error) {
            console.error('AI caption generation failed:', error);
            return this.generateSimple(originalCaption, options);
        }
    }
    buildPrompt(originalCaption, options) {
        const styleDescriptions = {
            funny: 'funny and humorous',
            professional: 'professional and clean',
            viral: 'catchy and viral-friendly',
            short: 'short and concise',
        };
        return `Generate an Instagram caption for reposting content. 
Original caption: "${originalCaption}"

Requirements:
- Style: ${styleDescriptions[options.style]}
- Language: ${options.language === 'ru' ? 'Russian' : 'English'}
- ${options.includeHashtags ? 'Include relevant hashtags' : 'No hashtags'}
- Keep it engaging and authentic

Return in format:
CAPTION: [your caption]
HASHTAGS: [hashtag1 hashtag2 hashtag3]`;
    }
    parseAIResponse(text) {
        const captionMatch = text.match(/CAPTION:\s*([\s\S]*?)(?:HASHTAGS:|$)/i);
        const hashtagsMatch = text.match(/HASHTAGS:\s*([\s\S]*?)$/i);
        const caption = captionMatch?.[1]?.trim() || text;
        const hashtags = hashtagsMatch?.[1]
            ?.split(/\s+/)
            .filter((h) => h.startsWith('#')) || [];
        return { caption, hashtags };
    }
    generateSimple(originalCaption, options) {
        let caption = originalCaption;
        caption = caption.replace(/#\w+/g, '').trim();
        const hashtags = options.includeHashtags
            ? ['#repost', '#viral', '#trending', '#fyp']
            : [];
        return { caption, hashtags };
    }
    generateHashtags(content, count = 10) {
        const keywords = this.extractKeywords(content);
        const tagPool = {
            viral: ['#viral', '#fyp', '#trending', '#explore', '#viralpost'],
            lifestyle: ['#lifestyle', '#life', '#daily', '#moment', '#instagood'],
            motivation: ['#motivation', '#inspiration', '#goals', '#success', '#mindset'],
            fun: ['#funny', '#lol', '#humor', '#comedy', '#memes'],
        };
        const tags = keywords
            .slice(0, count)
            .map((k) => `#${k.replace(/\s+/g, '')}`);
        return tags;
    }
    extractKeywords(text) {
        const words = text
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter((w) => w.length > 3);
        const stopWords = ['this', 'that', 'with', 'from', 'have', 'been', 'were'];
        return [...new Set(words.filter((w) => !stopWords.includes(w)))];
    }
};
exports.CaptionService = CaptionService;
exports.CaptionService = CaptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CaptionService);
//# sourceMappingURL=caption.service.js.map