import { v4 } from 'uuid';

import { Post } from '../models/Post';
import { AppDataSource } from '../database';
import { fieldsErrors } from '../utils/fieldsErrors';

type CreatePostParams = {
  title: string;
  description: string;
  images: any[];
};

type ListPostsParams = {
  limit: number;
  page: number;
};

const postRepository = AppDataSource.getRepository(Post);

export class PostRepository {
  async createPost({ title, description, images }: CreatePostParams) {
    if (!title || !description || !images.length) {
      return new Error('Preencha todos os campos', {
        cause: fieldsErrors({ title, description, images }),
      });
    }

    const post = await postRepository.findOneBy({ title });

    if (post) return new Error('Esse título já foi utilizado');

    const id = v4();

    const imagesData = images.map((image) =>
      Object({
        post_id: id,
        url: `${
          process.env.APP_HOST.includes('localhost')
            ? process.env.APP_HOST + ':' + process.env.APP_PORT
            : process.env.APP_HOST
        }/${image.path}`,
      })
    );

    // auto transaction
    const result = postRepository.create({
      id,
      title,
      description,
      images: imagesData,
    });

    await postRepository.save(result);

    return Object({
      status: '00',
      data: { ...result },
    });
  }

  async listPosts({ limit, page: current_page }: ListPostsParams) {
    if (!(await postRepository.count())) {
      return Object({ data: [], total: 0, current_page: 0 });
    }

    const [data, count] = await postRepository.findAndCount({
      take: Number(limit),
      skip: Number(current_page) * Number(limit),
      relations: ['images'],
    });

    return Object({ data, total: count, current_page });
  }

  async deletePost({ id }): Promise<Error | void> {
    const post = await postRepository.findOneBy({ id });

    if (!post) return new Error('Post não existe');

    await postRepository.delete(id);

    return Object({ status: '00', message: 'Post deletado com sucesso' });
  }

  async updatePost({ id, title, description, images }): Promise<Error | void> {
    const post = await postRepository.findOneBy({ id });

    if (!post) return new Error('Post não existe');

    title && (post.title = title);
    description && (post.description = description);
    // images.length && (post.images = post.images.concat(images));

    await postRepository.save(post);

    return Object({
      status: '00',
      data: { ...post },
    });
  }
}
