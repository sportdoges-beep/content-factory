import { Repository } from 'typeorm';
import { InstagramAccount } from './entities/instagram-account.entity';
import { ParentAccount } from './entities/parent-account.entity';
export declare class AccountsService {
    private instagramRepo;
    private parentRepo;
    constructor(instagramRepo: Repository<InstagramAccount>, parentRepo: Repository<ParentAccount>);
    findAllAccounts(userId: string): Promise<InstagramAccount[]>;
    createAccount(data: Partial<InstagramAccount>): Promise<InstagramAccount>;
    updateAccount(id: string, data: Partial<InstagramAccount>): Promise<InstagramAccount>;
    deleteAccount(id: string): Promise<void>;
    findAllParentAccounts(userId: string): Promise<ParentAccount[]>;
    createParentAccount(data: Partial<ParentAccount>): Promise<ParentAccount>;
    updateParentAccount(id: string, data: Partial<ParentAccount>): Promise<ParentAccount>;
    deleteParentAccount(id: string): Promise<void>;
    getActiveParentAccounts(): Promise<ParentAccount[]>;
}
