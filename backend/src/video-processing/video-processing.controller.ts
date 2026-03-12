import { Controller, Post, Body, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoProcessingService } from './video-processing.service';

@Controller('video-processing')
export class VideoProcessingController {
  constructor(private videoProcessingService: VideoProcessingService) {}

  @Post('process')
  async processVideo(
    @Body() body: {
      cropToReels?: boolean;
      addText?: boolean;
      text?: string;
      textPosition?: 'top' | 'bottom';
      textColor?: string;
    }
  ) {
    // В реальном приложении здесь будет загрузка файла
    return {
      success: true,
      message: 'Video processing endpoint ready',
      options: body,
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(@UploadedFile() video: any) {
    return {
      filename: video.originalname,
      size: video.size,
      message: 'Upload ready - connect with processing',
    };
  }

  @Post('info')
  async getVideoInfo(@Body() body: { path: string }) {
    try {
      const info = await this.videoProcessingService.getVideoInfo(body.path);
      return info;
    } catch (error) {
      return { error: 'Could not get video info' };
    }
  }
}
