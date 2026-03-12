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
exports.VideoProcessingController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const video_processing_service_1 = require("./video-processing.service");
let VideoProcessingController = class VideoProcessingController {
    constructor(videoProcessingService) {
        this.videoProcessingService = videoProcessingService;
    }
    async processVideo(body) {
        return {
            success: true,
            message: 'Video processing endpoint ready',
            options: body,
        };
    }
    async uploadVideo(video) {
        return {
            filename: video.originalname,
            size: video.size,
            message: 'Upload ready - connect with processing',
        };
    }
    async getVideoInfo(body) {
        try {
            const info = await this.videoProcessingService.getVideoInfo(body.path);
            return info;
        }
        catch (error) {
            return { error: 'Could not get video info' };
        }
    }
};
exports.VideoProcessingController = VideoProcessingController;
__decorate([
    (0, common_1.Post)('process'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideoProcessingController.prototype, "processVideo", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('video')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideoProcessingController.prototype, "uploadVideo", null);
__decorate([
    (0, common_1.Post)('info'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideoProcessingController.prototype, "getVideoInfo", null);
exports.VideoProcessingController = VideoProcessingController = __decorate([
    (0, common_1.Controller)('video-processing'),
    __metadata("design:paramtypes", [video_processing_service_1.VideoProcessingService])
], VideoProcessingController);
//# sourceMappingURL=video-processing.controller.js.map