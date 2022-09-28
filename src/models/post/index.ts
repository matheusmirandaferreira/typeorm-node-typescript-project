import {
  BeforeInsert,
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

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @Column()
  images: string;

  // @BeforeInsert()
  constructor() {
    if (!this.id) this.id = v4();
    this.created_at = new Date().toJSON();
    this.updated_at = new Date().toJSON();
  }
}
