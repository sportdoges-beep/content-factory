import { User } from '../../users/entities/user.entity';
import { InstagramAccount } from './instagram-account.entity';
export interface DownloadSettings {
    downloadReels: boolean;
    downloadPosts: boolean;
    downloadStories: boolean;
    excludeHashtags: string[];
}
export interface ProcessingSettings {
    addMask: boolean;
    maskStyle: 'full' | 'partial' | 'emoji';
    addMirror: boolean;
    addText: boolean;
    textPosition: 'top' | 'bottom';
    textColor: string;
    textFont: string;
}
export declare class ParentAccount {
    id: string;
    userId: string;
    user: User;
    username: string;
    instagramAccountId: string;
    instagramAccount: InstagramAccount;
    downloadSettings: DownloadSettings;
    processingSettings: ProcessingSettings;
    schedule: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
