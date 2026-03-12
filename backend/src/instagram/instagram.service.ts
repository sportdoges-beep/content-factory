import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface InstagramMedia {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  timestamp: string;
  permalink: string;
}

@Injectable()
export class InstagramService {
  private readonly baseUrl = 'https://graph.instagram.com';
  private readonly fields = 'id,media_type,media_url,thumbnail_url,caption,timestamp,permalink';

  constructor(private configService: ConfigService) {}

  // OAuth flow
  getAuthUrl(): string {
    const clientId = this.configService.get('INSTAGRAM_CLIENT_ID');
    const redirectUri = this.configService.get('INSTAGRAM_REDIRECT_URI');
    const scope = 'user_profile,user_media';
    
    return `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  }

  async exchangeCodeForToken(code: string): Promise<any> {
    const clientId = this.configService.get('INSTAGRAM_CLIENT_ID');
    const clientSecret = this.configService.get('INSTAGRAM_CLIENT_SECRET');
    const redirectUri = this.configService.get('INSTAGRAM_REDIRECT_URI');

    const response = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      }),
    });

    return response.json();
  }

  async getUserProfile(accessToken: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
    );
    return response.json();
  }

  async getUserMedia(accessToken: string, limit = 20): Promise<InstagramMedia[]> {
    const response = await fetch(
      `${this.baseUrl}/me/media?fields=${this.fields}&limit=${limit}&access_token=${accessToken}`
    );
    const data = await response.json();
    return data.data || [];
  }

  async getMediaByUsername(username: string, accessToken: string): Promise<InstagramMedia[]> {
    // Get user ID from username
    const userResponse = await fetch(
      `${this.baseUrl}/${username}?fields=id&access_token=${accessToken}`
    );
    const userData = await userResponse.json();
    
    if (!userData.id) return [];

    // Get media
    const mediaResponse = await fetch(
      `${this.baseUrl}/${userData.id}/media?fields=${this.fields}&limit=50&access_token=${accessToken}`
    );
    const mediaData = await mediaResponse.json();
    return mediaData.data || [];
  }

  async downloadMedia(mediaUrl: string): Promise<Buffer> {
    const response = await fetch(mediaUrl);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  // Publishing
  async createMediaContainer(accessToken: string, imageUrl: string, caption: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/me/media?image_url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(caption)}&access_token=${accessToken}`,
      { method: 'POST' }
    );
    return response.json();
  }

  async publishMedia(accessToken: string, creationId: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/me/media_publish?creation_id=${creationId}&access_token=${accessToken}`,
      { method: 'POST' }
    );
    return response.json();
  }
}
