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
export declare class InstagramService {
    private configService;
    private readonly baseUrl;
    private readonly fields;
    constructor(configService: ConfigService);
    getAuthUrl(): string;
    exchangeCodeForToken(code: string): Promise<any>;
    getUserProfile(accessToken: string): Promise<any>;
    getUserMedia(accessToken: string, limit?: number): Promise<InstagramMedia[]>;
    getMediaByUsername(username: string, accessToken: string): Promise<InstagramMedia[]>;
    downloadMedia(mediaUrl: string): Promise<Buffer>;
    createMediaContainer(accessToken: string, imageUrl: string, caption: string): Promise<any>;
    publishMedia(accessToken: string, creationId: string): Promise<any>;
}
