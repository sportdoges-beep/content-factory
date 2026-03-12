"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoProcessingService = void 0;
const common_1 = require("@nestjs/common");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
let VideoProcessingService = class VideoProcessingService {
    constructor() {
        this.outputDir = './uploads/processed';
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }
    async processVideo(inputPath, options) {
        const outputFileName = `processed_${Date.now()}.mp4`;
        const outputPath = path.join(this.outputDir, outputFileName);
        return new Promise((resolve, reject) => {
            let command = ffmpeg(inputPath);
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
            if (options.resizeWidth && options.resizeHeight) {
                command = command.size(`${options.resizeWidth}x${options.resizeHeight}`);
            }
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
    async getVideoInfo(inputPath) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(inputPath, (err, metadata) => {
                if (err) {
                    reject(err);
                }
                else {
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
    async downloadVideo(url, outputPath) {
        return new Promise((resolve, reject) => {
            const { exec } = require('child_process');
            exec(`curl -L -o "${outputPath}" "${url}"`, (error) => {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    }
    async addWatermark(inputPath, watermarkPath, position = 'W-w-10:10') {
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
    async convertForInstagram(inputPath) {
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
};
exports.VideoProcessingService = VideoProcessingService;
exports.VideoProcessingService = VideoProcessingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], VideoProcessingService);
//# sourceMappingURL=video-processing.service.js.map