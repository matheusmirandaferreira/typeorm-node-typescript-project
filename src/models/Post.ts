import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 } from 'uuid';

import { Image } from './Image';

@Entity('post')
export class Post {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(() => Image, (image) => image.post, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  images: Image[];

  @CreateDateColumn({ type: 'timestamptz', generated: true })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamptz', generated: true })
  updated_at: string;

  constructor() {
    if (!this.id) this.id = v4();
  }
}
