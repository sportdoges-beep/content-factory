import { User } from '../../users/entities/user.entity';
export declare enum AccountStatus {
    ACTIVE = "active",
    PAUSED = "paused",
    ERROR = "error"
}
export declare class InstagramAccount {
    id: string;
    userId: string;
    user: User;
    username: string;
    accessToken: string;
    accountId: string;
    status: AccountStatus;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
