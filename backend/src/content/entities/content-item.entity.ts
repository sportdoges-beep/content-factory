import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ParentAccount } from '../accounts/entities/parent-account.entity';

export enum ContentStatus {
  PENDING = 'pending',
  DOWNLOADING = 'downloading',
  PROCESSING = 'processing',
  READY = 'ready',
  PUBLISHING = 'publishing',
  PUBLISHED = 'published',
  FAILED = 'failed',
}

@Entity('content_items')
export class ContentItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  parentAccountId: string;

  @ManyToOne(() => ParentAccount)
  @JoinColumn({ name: 'parentAccountId' })
  parentAccount: ParentAccount;

  @Column()
  externalMediaId: string;

  @Column('text')
  originalMediaUrl: string;

  @Column({ nullable: true })
  originalCaption: string;

  @Column('text', { nullable: true })
  processedMediaUrl: string;

  @Column({ nullable: true })
  processedCaption: string;

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.PENDING,
  })
  status: ContentStatus;

  @Column({ nullable: true })
  instagramPostId: string;

  @Column({ nullable: true })
  publishedAt: Date;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}
