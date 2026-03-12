export interface VideoProcessingOptions {
    cropToReels?: boolean;
    addText?: boolean;
    text?: string;
    textPosition?: 'top' | 'bottom';
    textColor?: string;
    addSticker?: boolean;
    stickerUrl?: string;
    stickerPosition?: {
        x: number;
        y: number;
    };
    resizeWidth?: number;
    resizeHeight?: number;
    addFadeIn?: number;
    addFadeOut?: number;
}
export declare class VideoProcessingService {
    private readonly outputDir;
    constructor();
    processVideo(inputPath: string, options: VideoProcessingOptions): Promise<string>;
    getVideoInfo(inputPath: string): Promise<any>;
    downloadVideo(url: string, outputPath: string): Promise<void>;
    addWatermark(inputPath: string, watermarkPath: string, position?: string): Promise<string>;
    convertForInstagram(inputPath: string): Promise<string>;
}
