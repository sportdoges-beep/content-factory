import { Module } from '@nestjs/common';
import { VideoProcessingService } from './video-processing.service';
import { VideoProcessingController } from './video-processing.controller';

@Module({
  controllers: [VideoProcessingController],
  providers: [VideoProcessingService],
  exports: [VideoProcessingService],
})
export class VideoProcessingModule {}
