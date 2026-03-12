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
exports.ContentItem = exports.ContentStatus = void 0;
const typeorm_1 = require("typeorm");
var ContentStatus;
(function (ContentStatus) {
    ContentStatus["PENDING"] = "pending";
    ContentStatus["DOWNLOADING"] = "downloading";
    ContentStatus["PROCESSING"] = "processing";
    ContentStatus["READY"] = "ready";
    ContentStatus["PUBLISHING"] = "publishing";
    ContentStatus["PUBLISHED"] = "published";
    ContentStatus["FAILED"] = "failed";
})(ContentStatus || (exports.ContentStatus = ContentStatus = {}));
let ContentItem = class ContentItem {
};
exports.ContentItem = ContentItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ContentItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContentItem.prototype, "parentAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContentItem.prototype, "externalMediaId", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ContentItem.prototype, "originalMediaUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ContentItem.prototype, "originalCaption", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], ContentItem.prototype, "processedMediaUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ContentItem.prototype, "processedCaption", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ContentStatus,
        default: ContentStatus.PENDING,
    }),
    __metadata("design:type", String)
], ContentItem.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ContentItem.prototype, "instagramPostId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ContentItem.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ContentItem.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ContentItem.prototype, "createdAt", void 0);
exports.ContentItem = ContentItem = __decorate([
    (0, typeorm_1.Entity)('content_items')
], ContentItem);
//# sourceMappingURL=content-item.entity.js.map