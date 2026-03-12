import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InstagramAccount } from './instagram-account.entity';

export interface DownloadSettings {
  downloadReels: boolean;
  downloadPosts: boolean;
  downloadStories: boolean;
  excludeHashtags: string[];
}

export interface ProcessingSettings {
  addMask: boolean;
  maskStyle: 'full' | 'partial' | 'emoji';
  addMirror: boolean;
  addText: boolean;
  textPosition: 'top' | 'bottom';
  textColor: string;
  textFont: string;
}

@Entity('parent_accounts')
export class ParentAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  username: string;

  @Column()
  instagramAccountId: string;

  @ManyToOne(() => InstagramAccount)
  @JoinColumn({ name: 'instagramAccountId' })
  instagramAccount: InstagramAccount;

  @Column('jsonb', { default: {} })
  downloadSettings: DownloadSettings;

  @Column('jsonb', { default: {} })
  processingSettings: ProcessingSettings;

  @Column({ default: '0 0 * * *' }) // Daily at midnight
  schedule: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
