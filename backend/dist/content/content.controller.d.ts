import { ContentService } from './content.service';
export declare class ContentController {
    private contentService;
    constructor(contentService: ContentService);
    findAll(req: any): Promise<import("./entities/content-item.entity").ContentItem[]>;
    triggerDownload(id: string): Promise<import("./entities/content-item.entity").ContentItem[]>;
    processContent(id: string): Promise<import("./entities/content-item.entity").ContentItem>;
    publishContent(id: string): Promise<import("./entities/content-item.entity").ContentItem>;
}
