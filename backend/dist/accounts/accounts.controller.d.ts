import { AccountsService } from './accounts.service';
export declare class AccountsController {
    private accountsService;
    constructor(accountsService: AccountsService);
    findAll(req: any): Promise<import("./entities/instagram-account.entity").InstagramAccount[]>;
    create(req: any, data: any): Promise<import("./entities/instagram-account.entity").InstagramAccount>;
    update(id: string, data: any): Promise<import("./entities/instagram-account.entity").InstagramAccount>;
    delete(id: string): Promise<void>;
    findAllParents(req: any): Promise<import("./entities/parent-account.entity").ParentAccount[]>;
    createParent(req: any, data: any): Promise<import("./entities/parent-account.entity").ParentAccount>;
    updateParent(id: string, data: any): Promise<import("./entities/parent-account.entity").ParentAccount>;
    deleteParent(id: string): Promise<void>;
}
