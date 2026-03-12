import { Response } from 'express';
import { InstagramService } from './instagram.service';
export declare class InstagramController {
    private instagramService;
    constructor(instagramService: InstagramService);
    auth(res: Response): Promise<void>;
    callback(code: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    getMedia(accessToken: string): Promise<import("./instagram.service").InstagramMedia[]>;
}
