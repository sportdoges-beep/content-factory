import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';

export interface VideoProcessingOptions {
  cropToReels?: boolean;
  addText?: boolean;
  text?: string;
  textPosition?: 'top' | 'bottom';
  textColor?: string;
  addSticker?: boolean;
  stickerUrl?: string;
  stickerPosition?: { x: number; y: number };
  resizeWidth?: number;
  resizeHeight?: number;
  addFadeIn?: number;
  addFadeOut?: number;
}

@Injectable()
export class VideoProcessingService {
  private readonly outputDir = './uploads/processed';

  constructor() {
    // Создаём директорию для обработанных видео
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Основной метод обработки видео
   */
  async processVideo(
    inputPath: string,
    options: VideoProcessingOptions
  ): Promise<string> {
    const outputFileName = `processed_${Date.now()}.mp4`;
    const outputPath = path.join(this.outputDir, outputFileName);

    return new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath);

      // 1. Обрезка под Reels (9:16)
      if (options.cropToReels) {
        command = command
          .videoFilters([
            {
              filter: 'crop',
              options: {
                w: 'ih*9/16',
                h: 'ih',
                x: '(iw-iw*9/16)/2',
                y: '0',
              },
            },
          ]);
      }

      // 2. Ресайз
      if (options.resizeWidth && options.resizeHeight) {
        command = command.size(`${options.resizeWidth}x${options.resizeHeight}`);
      }

      // 3. Добавить текст
      if (options.addText && options.text) {
        const position = options.textPosition === 'top' ? '10:10' : '10:h-30';
        const color = options.textColor || 'white';

        command = command.videoFilters([
          {
            filter: 'drawtext',
            options: {
              text: options.text,
              fontcolor: color,
              fontsize: 24,
              x: position,
              box: 1,
              boxcolor: 'black@0.5',
              boxborderw: 5,
            },
          },
        ]);
      }

      // 4. Fade in/out
      if (options.addFadeIn) {
        command = command.videoFilters([
          `fade=t=in:st=0:d=${options.addFadeIn}`,
        ]);
      }
      if (options.addFadeOut) {
        command = command.videoFilters([
          `fade=t=out:st=-${options.addFadeOut}:d=${options.addFadeOut}`,
        ]);
      }

      // Настройки качества
      command
        .outputOptions([
          '-c:v libx264',
          '-preset fast',
          '-crf 23',
          '-c:a aac',
          '-b:a 128k',
        ])
        .output(outputPath)
        .on('end', () => {
          console.log(`Video processed: ${outputPath}`);
          resolve(outputPath);
        })
        .on('error', (err) => {
          console.error('Error processing video:', err);
          reject(err);
        })
        .run();
    });
  }

  /**
   * Получить информацию о видео
   */
  async getVideoInfo(inputPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            duration: metadata.format.duration,
            width: metadata.streams[0].width,
            height: metadata.streams[0].height,
            codec: metadata.streams[0].codec_name,
            fps: metadata.streams[0].r_frame_rate,
          });
        }
      });
    });
  }

  /**
   * Скачать видео по URL
   */
  async downloadVideo(url: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const { exec } = require('child_process');
      exec(
        `curl -L -o "${outputPath}" "${url}"`,
        (error: any) => {
          if (error) reject(error);
          else resolve();
        }
      );
    });
  }

  /**
   * Добавить watermark (опционально)
   */
  async addWatermark(
    inputPath: string,
    watermarkPath: string,
    position: string = 'W-w-10:10'
  ): Promise<string> {
    const outputFileName = `watermarked_${Date.now()}.mp4`;
    const outputPath = path.join(this.outputDir, outputFileName);

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .input(watermarkPath)
        .complexFilter([`overlay=${position}`])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  /**
   * Конвертировать видео для Instagram
   */
  async convertForInstagram(inputPath: string): Promise<string> {
    const outputFileName = `instagram_${Date.now()}.mp4`;
    const outputPath = path.join(this.outputDir, outputFileName);

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-c:v libx264',
          '-preset fast',
          '-crf 23',
          '-movflags +faststart',
          '-c:a aac',
          '-b:a 128k',
          '-vf scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2',
        ])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }
}
