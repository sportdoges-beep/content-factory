import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContentService } from './content.service';

@Controller('content')
@UseGuards(AuthGuard('jwt'))
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get()
  async findAll(@Request() req) {
    return this.contentService.findAll(req.user.id);
  }

  @Post(':parentAccountId/download')
  async triggerDownload(@Param('parentAccountId') id: string) {
    return this.contentService.triggerDownload(id);
  }

  @Post(':id/process')
  async processContent(@Param('id') id: string) {
    return this.contentService.processContent(id);
  }

  @Post(':id/publish')
  async publishContent(@Param('id') id: string) {
    return this.contentService.publishContent(id);
  }
}
