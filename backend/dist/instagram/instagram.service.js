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
exports.InstagramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let InstagramService = class InstagramService {
    constructor(configService) {
        this.configService = configService;
        this.baseUrl = 'https://graph.instagram.com';
        this.fields = 'id,media_type,media_url,thumbnail_url,caption,timestamp,permalink';
    }
    getAuthUrl() {
        const clientId = this.configService.get('INSTAGRAM_CLIENT_ID');
        const redirectUri = this.configService.get('INSTAGRAM_REDIRECT_URI');
        const scope = 'user_profile,user_media';
        return `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    }
    async exchangeCodeForToken(code) {
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
    async getUserProfile(accessToken) {
        const response = await fetch(`${this.baseUrl}/me?fields=id,username,account_type,media_count&access_token=${accessToken}`);
        return response.json();
    }
    async getUserMedia(accessToken, limit = 20) {
        const response = await fetch(`${this.baseUrl}/me/media?fields=${this.fields}&limit=${limit}&access_token=${accessToken}`);
        const data = await response.json();
        return data.data || [];
    }
    async getMediaByUsername(username, accessToken) {
        const userResponse = await fetch(`${this.baseUrl}/${username}?fields=id&access_token=${accessToken}`);
        const userData = await userResponse.json();
        if (!userData.id)
            return [];
        const mediaResponse = await fetch(`${this.baseUrl}/${userData.id}/media?fields=${this.fields}&limit=50&access_token=${accessToken}`);
        const mediaData = await mediaResponse.json();
        return mediaData.data || [];
    }
    async downloadMedia(mediaUrl) {
        const response = await fetch(mediaUrl);
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
    async createMediaContainer(accessToken, imageUrl, caption) {
        const response = await fetch(`${this.baseUrl}/me/media?image_url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(caption)}&access_token=${accessToken}`, { method: 'POST' });
        return response.json();
    }
    async publishMedia(accessToken, creationId) {
        const response = await fetch(`${this.baseUrl}/me/media_publish?creation_id=${creationId}&access_token=${accessToken}`, { method: 'POST' });
        return response.json();
    }
};
exports.InstagramService = InstagramService;
exports.InstagramService = InstagramService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], InstagramService);
//# sourceMappingURL=instagram.service.js.map