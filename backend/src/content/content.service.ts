import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentItem, ContentStatus } from './entities/content-item.entity';
import { InstagramService } from '../instagram/instagram.service';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentItem)
    private contentRepo: Repository<ContentItem>,
    private instagramService: InstagramService,
    private accountsService: AccountsService,
  ) {}

  async findAll(userId: string): Promise<ContentItem[]> {
    return this.contentRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async triggerDownload(parentAccountId: string): Promise<ContentItem[]> {
    const parent = await this.accountsService['parentRepo'].findOne({
      where: { id: parentAccountId },
      relations: ['instagramAccount'],
    });

    if (!parent || !parent.instagramAccount) {
      throw new NotFoundException('Parent account not found');
    }

    const accessToken = parent.instagramAccount.accessToken;
    const media = await this.instagramService.getMediaByUsername(
      parent.username,
      accessToken
    );

    const items: ContentItem[] = [];
    for (const m of media) {
      const existing = await this.contentRepo.findOne({
        where: { externalMediaId: m.id, parentAccountId },
      });

      if (!existing) {
        const item = this.contentRepo.create({
          parentAccountId,
          externalMediaId: m.id,
          originalMediaUrl: m.mediaUrl,
          originalCaption: m.caption,
          status: ContentStatus.PENDING,
        });
        items.push(await this.contentRepo.save(item));
      }
    }

    return items;
  }

  async processContent(itemId: string): Promise<ContentItem> {
    const item = await this.contentRepo.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Content not found');

    item.status = ContentStatus.PROCESSING;
    await this.contentRepo.save(item);

    const buffer = await this.instagramService.downloadMedia(item.originalMediaUrl);
    const processedUrl = await this.processVideo(buffer, item.parentAccountId);

    item.processedMediaUrl = processedUrl;
    item.status = ContentStatus.READY;
    return this.contentRepo.save(item);
  }

  async publishContent(itemId: string): Promise<ContentItem> {
    const item = await this.contentRepo.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Content not found');

    const parent = await this.accountsService['parentRepo'].findOne({
      where: { id: item.parentAccountId },
      relations: ['instagramAccount'],
    });

    if (!parent || !parent.instagramAccount) {
      throw new NotFoundException('Parent account not found');
    }

    item.status = ContentStatus.PUBLISHING;
    await this.contentRepo.save(item);

    try {
      const container = await this.instagramService.createMediaContainer(
        parent.instagramAccount.accessToken,
        item.processedMediaUrl || item.originalMediaUrl,
        item.processedCaption || item.originalCaption
      );

      if (container.id) {
        const result = await this.instagramService.publishMedia(
          parent.instagramAccount.accessToken,
          container.id
        );
        item.instagramPostId = result.id;
        item.status = ContentStatus.PUBLISHED;
        item.publishedAt = new Date();
      }
    } catch (error) {
      item.status = ContentStatus.FAILED;
      item.errorMessage = error.message || 'Unknown error';
    }

    return this.contentRepo.save(item);
  }

  private async processVideo(buffer: Buffer, parentAccountId: string): Promise<string> {
    return 'https://processed-video-url.com/video.mp4';
  }
}
