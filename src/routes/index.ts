import express, { Router } from 'express';
import { authMiddleware, uploads } from '../middleware';
import { PostController, UserController } from '../controllers';

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
    const imageUpload = uploads.array('image');
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
