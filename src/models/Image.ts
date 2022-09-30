import { v4 } from 'uuid';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Post } from './Post';

@Entity('image')
export class Image {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  post_id: string;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  constructor() {
    if (!this.id) this.id = v4();
  }
}
