import { Repository } from 'typeorm';
import { ContentItem } from './entities/content-item.entity';
import { InstagramService } from '../instagram/instagram.service';
import { AccountsService } from '../accounts/accounts.service';
export declare class ContentService {
    private contentRepo;
    private instagramService;
    private accountsService;
    constructor(contentRepo: Repository<ContentItem>, instagramService: InstagramService, accountsService: AccountsService);
    findAll(userId: string): Promise<ContentItem[]>;
    triggerDownload(parentAccountId: string): Promise<ContentItem[]>;
    processContent(itemId: string): Promise<ContentItem>;
    publishContent(itemId: string): Promise<ContentItem>;
    private processVideo;
}
