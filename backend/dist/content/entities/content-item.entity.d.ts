export declare enum ContentStatus {
    PENDING = "pending",
    DOWNLOADING = "downloading",
    PROCESSING = "processing",
    READY = "ready",
    PUBLISHING = "publishing",
    PUBLISHED = "published",
    FAILED = "failed"
}
export declare class ContentItem {
    id: string;
    parentAccountId: string;
    externalMediaId: string;
    originalMediaUrl: string;
    originalCaption: string;
    processedMediaUrl: string;
    processedCaption: string;
    status: ContentStatus;
    instagramPostId: string;
    publishedAt: Date;
    errorMessage: string;
    createdAt: Date;
}
