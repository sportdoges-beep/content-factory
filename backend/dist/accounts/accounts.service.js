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
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const instagram_account_entity_1 = require("./entities/instagram-account.entity");
const parent_account_entity_1 = require("./entities/parent-account.entity");
let AccountsService = class AccountsService {
    constructor(instagramRepo, parentRepo) {
        this.instagramRepo = instagramRepo;
        this.parentRepo = parentRepo;
    }
    async findAllAccounts(userId) {
        return this.instagramRepo.find({ where: { userId } });
    }
    async createAccount(data) {
        const account = this.instagramRepo.create(data);
        return this.instagramRepo.save(account);
    }
    async updateAccount(id, data) {
        await this.instagramRepo.update(id, data);
        const account = await this.instagramRepo.findOne({ where: { id } });
        if (!account)
            throw new common_1.NotFoundException('Account not found');
        return account;
    }
    async deleteAccount(id) {
        await this.instagramRepo.delete(id);
    }
    async findAllParentAccounts(userId) {
        return this.parentRepo.find({
            where: { userId },
            relations: ['instagramAccount'],
        });
    }
    async createParentAccount(data) {
        const account = this.parentRepo.create(data);
        return this.parentRepo.save(account);
    }
    async updateParentAccount(id, data) {
        await this.parentRepo.update(id, data);
        const account = await this.parentRepo.findOne({
            where: { id },
            relations: ['instagramAccount'],
        });
        if (!account)
            throw new common_1.NotFoundException('Parent account not found');
        return account;
    }
    async deleteParentAccount(id) {
        await this.parentRepo.delete(id);
    }
    async getActiveParentAccounts() {
        return this.parentRepo.find({
            where: { isActive: true },
            relations: ['instagramAccount', 'instagramAccount.user'],
        });
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(instagram_account_entity_1.InstagramAccount)),
    __param(1, (0, typeorm_1.InjectRepository)(parent_account_entity_1.ParentAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AccountsService);
//# sourceMappingURL=accounts.service.js.map