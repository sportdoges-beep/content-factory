import { VideoProcessingService } from './video-processing.service';
export declare class VideoProcessingController {
    private videoProcessingService;
    constructor(videoProcessingService: VideoProcessingService);
    processVideo(body: {
        cropToReels?: boolean;
        addText?: boolean;
        text?: string;
        textPosition?: 'top' | 'bottom';
        textColor?: string;
    }): Promise<{
        success: boolean;
        message: string;
        options: {
            cropToReels?: boolean;
            addText?: boolean;
            text?: string;
            textPosition?: "top" | "bottom";
            textColor?: string;
        };
    }>;
    uploadVideo(video: any): Promise<{
        filename: any;
        size: any;
        message: string;
    }>;
    getVideoInfo(body: {
        path: string;
    }): Promise<any>;
}
