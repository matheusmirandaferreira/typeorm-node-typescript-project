import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';

import { AppDataSource } from './database';
import { authMiddleware, uploads } from './middleware';
import { UserController } from './controllers/userController';
import { PostController } from './controllers/postController';

const app = express();

dotenv.config();

app.use(express.json());
app.use('/public/storage', express.static('public/storage'));

app.post('/api/auth', new UserController().login);

app.get('/api/post', new PostController().listPosts);

app.post('/api/create-user', authMiddleware, new UserController().createUser);

app.post(
  '/api/create-post',
  authMiddleware,
  (req, res, next) => {
    const imageUpload = uploads.array('image');
    imageUpload(req, res, (err) => {
      if (err instanceof Error)
        return res.status(422).json({ message: err.message });
      next();
    });
  },
  new PostController().createPost
);

app.delete('/api/post/:id', authMiddleware);

const main = () =>
  Promise.resolve(AppDataSource.initialize())
    .then(() => console.log('Database started successfully'))
    .catch((err) => console.log('Error on start database', err));

app.listen(process.env.APP_PORT, main);
