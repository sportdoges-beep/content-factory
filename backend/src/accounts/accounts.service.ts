import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstagramAccount, AccountStatus } from './entities/instagram-account.entity';
import { ParentAccount } from './entities/parent-account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(InstagramAccount)
    private instagramRepo: Repository<InstagramAccount>,
    @InjectRepository(ParentAccount)
    private parentRepo: Repository<ParentAccount>,
  ) {}

  // Instagram Accounts
  async findAllAccounts(userId: string): Promise<InstagramAccount[]> {
    return this.instagramRepo.find({ where: { userId } });
  }

  async createAccount(data: Partial<InstagramAccount>): Promise<InstagramAccount> {
    const account = this.instagramRepo.create(data);
    return this.instagramRepo.save(account);
  }

  async updateAccount(id: string, data: Partial<InstagramAccount>): Promise<InstagramAccount> {
    await this.instagramRepo.update(id, data);
    const account = await this.instagramRepo.findOne({ where: { id } });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async deleteAccount(id: string): Promise<void> {
    await this.instagramRepo.delete(id);
  }

  // Parent Accounts
  async findAllParentAccounts(userId: string): Promise<ParentAccount[]> {
    return this.parentRepo.find({ 
      where: { userId },
      relations: ['instagramAccount'],
    });
  }

  async createParentAccount(data: Partial<ParentAccount>): Promise<ParentAccount> {
    const account = this.parentRepo.create(data);
    return this.parentRepo.save(account);
  }

  async updateParentAccount(id: string, data: Partial<ParentAccount>): Promise<ParentAccount> {
    await this.parentRepo.update(id, data);
    const account = await this.parentRepo.findOne({ 
      where: { id },
      relations: ['instagramAccount'],
    });
    if (!account) throw new NotFoundException('Parent account not found');
    return account;
  }

  async deleteParentAccount(id: string): Promise<void> {
    await this.parentRepo.delete(id);
  }

  async getActiveParentAccounts(): Promise<ParentAccount[]> {
    return this.parentRepo.find({
      where: { isActive: true },
      relations: ['instagramAccount', 'instagramAccount.user'],
    });
  }
}
