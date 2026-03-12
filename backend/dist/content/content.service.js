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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const content_item_entity_1 = require("./entities/content-item.entity");
const instagram_service_1 = require("../instagram/instagram.service");
const accounts_service_1 = require("../accounts/accounts.service");
let ContentService = class ContentService {
    constructor(contentRepo, instagramService, accountsService) {
        this.contentRepo = contentRepo;
        this.instagramService = instagramService;
        this.accountsService = accountsService;
    }
    async findAll(userId) {
        return this.contentRepo.find({
            order: { createdAt: 'DESC' },
        });
    }
    async triggerDownload(parentAccountId) {
        const parent = await this.accountsService['parentRepo'].findOne({
            where: { id: parentAccountId },
            relations: ['instagramAccount'],
        });
        if (!parent || !parent.instagramAccount) {
            throw new common_1.NotFoundException('Parent account not found');
        }
        const accessToken = parent.instagramAccount.accessToken;
        const media = await this.instagramService.getMediaByUsername(parent.username, accessToken);
        const items = [];
        for (const m of media) {
            const existing = await this.contentRepo.findOne({
                where: { externalMediaId: m.id, parentAccountId },
            });
            if (!existing) {
                const item = this.contentRepo.create({
                    parentAccountId,
                    externalMediaId: m.id,
                    originalMediaUrl: m.mediaUrl,
                    originalCaption: m.caption,
                    status: content_item_entity_1.ContentStatus.PENDING,
                });
                items.push(await this.contentRepo.save(item));
            }
        }
        return items;
    }
    async processContent(itemId) {
        const item = await this.contentRepo.findOne({ where: { id: itemId } });
        if (!item)
            throw new common_1.NotFoundException('Content not found');
        item.status = content_item_entity_1.ContentStatus.PROCESSING;
        await this.contentRepo.save(item);
        const buffer = await this.instagramService.downloadMedia(item.originalMediaUrl);
        const processedUrl = await this.processVideo(buffer, item.parentAccountId);
        item.processedMediaUrl = processedUrl;
        item.status = content_item_entity_1.ContentStatus.READY;
        return this.contentRepo.save(item);
    }
    async publishContent(itemId) {
        const item = await this.contentRepo.findOne({ where: { id: itemId } });
        if (!item)
            throw new common_1.NotFoundException('Content not found');
        const parent = await this.accountsService['parentRepo'].findOne({
            where: { id: item.parentAccountId },
            relations: ['instagramAccount'],
        });
        if (!parent || !parent.instagramAccount) {
            throw new common_1.NotFoundException('Parent account not found');
        }
        item.status = content_item_entity_1.ContentStatus.PUBLISHING;
        await this.contentRepo.save(item);
        try {
            const container = await this.instagramService.createMediaContainer(parent.instagramAccount.accessToken, item.processedMediaUrl || item.originalMediaUrl, item.processedCaption || item.originalCaption);
            if (container.id) {
                const result = await this.instagramService.publishMedia(parent.instagramAccount.accessToken, container.id);
                item.instagramPostId = result.id;
                item.status = content_item_entity_1.ContentStatus.PUBLISHED;
                item.publishedAt = new Date();
            }
        }
        catch (error) {
            item.status = content_item_entity_1.ContentStatus.FAILED;
            item.errorMessage = error.message || 'Unknown error';
        }
        return this.contentRepo.save(item);
    }
    async processVideo(buffer, parentAccountId) {
        return 'https://processed-video-url.com/video.mp4';
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(content_item_entity_1.ContentItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        instagram_service_1.InstagramService,
        accounts_service_1.AccountsService])
], ContentService);
//# sourceMappingURL=content.service.js.map