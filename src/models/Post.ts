import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { v4 } from 'uuid';

@Entity('post')
export class Post {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamptz', generated: true })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamptz', generated: true })
  updated_at: string;

  @Column()
  images: string;

  constructor() {
    if (!this.id) this.id = v4();
  }
}
