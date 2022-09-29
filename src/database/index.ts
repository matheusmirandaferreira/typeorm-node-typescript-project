import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Post } from '../models/Post';
import { User } from '../models/User';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  entities: [Post, User],
  migrations: ['src/database/migrations/*.ts'],
});

export { AppDataSource };
