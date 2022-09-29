import express, { Router } from 'express';

import { authMiddleware } from '../middleware/authMiddleware';
import { uploadsMiddleware } from '../middleware/uploadsMiddleware';

import { PostController } from '../controllers/PostController';
import { UserController } from '../controllers/UserController';

const routes = Router();

routes.use(express.json());
routes.use('/public/storage', express.static('public/storage'));

routes.post('/api/auth', new UserController().login);

routes.get('/api/post', new PostController().listPosts);

routes.post(
  '/api/user/create',
  authMiddleware,
  new UserController().createUser
);

routes.post(
  '/api/post/create',
  authMiddleware,
  (req, res, next) => {
    const imageUpload = uploadsMiddleware.array('image');
    imageUpload(req, res, (err) => {
      if (err instanceof Error)
        return res.status(422).json({ message: err.message });
      next();
    });
  },
  new PostController().createPost
);

routes.delete('/api/post/:id', authMiddleware, new PostController().deletePost);

routes.put('/api/post/:id', authMiddleware, new PostController().updatePost);

export { routes };
