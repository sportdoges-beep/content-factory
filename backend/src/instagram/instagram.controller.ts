import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { InstagramService } from './instagram.service';

@Controller('instagram')
export class InstagramController {
  constructor(private instagramService: InstagramService) {}

  @Get('auth')
  async auth(@Res() res: Response) {
    const url = this.instagramService.getAuthUrl();
    res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string) {
    // In real app, exchange code for token and save to user account
    const tokenData = await this.instagramService.exchangeCodeForToken(code);
    return {
      success: true,
      data: tokenData,
      message: 'Code received. In production, token would be saved to user account.',
    };
  }

  @Get('media')
  async getMedia(@Query('accessToken') accessToken: string) {
    return this.instagramService.getUserMedia(accessToken);
  }
}
