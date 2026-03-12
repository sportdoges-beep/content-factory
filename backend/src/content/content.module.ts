import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentItem } from './entities/content-item.entity';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { InstagramModule } from '../instagram/instagram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentItem]),
    InstagramModule,
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
