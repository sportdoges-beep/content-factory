import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CaptionService {
  private readonly openaiApiKey: string;

  constructor(private configService: ConfigService) {
    this.openaiApiKey = this.configService.get('OPENAI_API_KEY', '');
  }

  /**
   * Генерация caption на основе контента
   */
  async generateCaption(
    originalCaption: string,
    options: {
      includeHashtags?: boolean;
      style?: 'funny' | 'professional' | 'viral' | 'short';
      language?: 'en' | 'ru';
    } = {}
  ): Promise<{ caption: string; hashtags: string[] }> {
    const { includeHashtags = true, style = 'viral', language = 'en' } = options;

    // Если есть OpenAI API - используем его
    if (this.openaiApiKey) {
      return this.generateWithAI(originalCaption, { includeHashtags, style, language });
    }

    // Иначе - простая генерация
    return this.generateSimple(originalCaption, { includeHashtags, language });
  }

  private async generateWithAI(
    originalCaption: string,
    options: any
  ): Promise<{ caption: string; hashtags: string[] }> {
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
    } catch (error) {
      console.error('AI caption generation failed:', error);
      return this.generateSimple(originalCaption, options);
    }
  }

  private buildPrompt(originalCaption: string, options: any): string {
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

  private parseAIResponse(text: string): { caption: string; hashtags: string[] } {
    const captionMatch = text.match(/CAPTION:\s*([\s\S]*?)(?:HASHTAGS:|$)/i);
    const hashtagsMatch = text.match(/HASHTAGS:\s*([\s\S]*?)$/i);

    const caption = captionMatch?.[1]?.trim() || text;
    const hashtags = hashtagsMatch?.[1]
      ?.split(/\s+/)
      .filter((h) => h.startsWith('#')) || [];

    return { caption, hashtags };
  }

  private generateSimple(
    originalCaption: string,
    options: any
  ): { caption: string; hashtags: string[] } {
    // Простая генерация - очищаем и добавляем хештеги
    let caption = originalCaption;

    // Убираем лишнее
    caption = caption.replace(/#\w+/g, '').trim();

    // Добавляем дефолтные хештеги если нужно
    const hashtags = options.includeHashtags
      ? ['#repost', '#viral', '#trending', '#fyp']
      : [];

    return { caption, hashtags };
  }

  /**
   * Генерация хештегов на основе контента
   */
  generateHashtags(content: string, count: number = 10): string[] {
    const keywords = this.extractKeywords(content);
    
    // Базовые хештеги по категориям
    const tagPool: Record<string, string[]> = {
      viral: ['#viral', '#fyp', '#trending', '#explore', '#viralpost'],
      lifestyle: ['#lifestyle', '#life', '#daily', '#moment', '#instagood'],
      motivation: ['#motivation', '#inspiration', '#goals', '#success', '#mindset'],
      fun: ['#funny', '#lol', '#humor', '#comedy', '#memes'],
    };

    // Простой подбор хештегов
    const tags = keywords
      .slice(0, count)
      .map((k) => `#${k.replace(/\s+/g, '')}`);

    return tags;
  }

  private extractKeywords(text: string): string[] {
    // Простое извлечение ключевых слов
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3);

    // Убираем стоп-слова
    const stopWords = ['this', 'that', 'with', 'from', 'have', 'been', 'were'];
    return [...new Set(words.filter((w) => !stopWords.includes(w)))];
  }
}
