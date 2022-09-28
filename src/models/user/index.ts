import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 } from 'uuid';
import bcrypt from 'bcryptjs';

@Entity('user')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column({})
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
  }

  toJSON() {
    return {
      ...this,
      password: undefined,
    };
  }

  constructor() {
    if (!this.id) this.id = v4();
    this.created_at = new Date().toJSON();
    this.updated_at = new Date().toJSON();
  }
}
