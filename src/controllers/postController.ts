import { Request, Response } from 'express';

import { PostRepository } from '../repository/postRepository';

type Params = {
  title: string;
  description: string;
};

const repo = new PostRepository();

export class PostController {
  async createPost(req: Request, res: Response) {
    try {
      const { title, description } = req.body as Params;
      const images = req.files as any[];

      const result = await repo.createPost({ description, images, title });

      if (result instanceof Error) {
        return res
          .status(400)
          .json({ message: result.message, errors: result.cause });
      }

      return res.json(result);
    } catch (error) {
      console.log('error', error);
      return res
        .status(500)
        .json({ message: 'Houve um erro ao criar seu post', errors: error });
    }
  }

  async listPosts(req: Request, res: Response) {
    try {
      const { page = 0, limit = 10 } = req.query;

      const result = await repo.listPosts({
        limit: Number(limit),
        page: Number(page),
      });

      return res.json(result);
    } catch (err) {
      console.log('err', err);
      return res
        .status(500)
        .json({ message: 'Houve um erro ao carregar os post' });
    }
  }
}
