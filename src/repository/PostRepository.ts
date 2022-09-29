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

    const paths: string = images
      .map(
        (image: any) =>
          `${
            process.env.APP_HOST.includes('localhost')
              ? process.env.APP_HOST + ':' + process.env.APP_PORT
              : process.env.APP_HOST
          }/${image.path}`
      )
      .join(', ');

    const result = postRepository.create({
      title,
      description,
      images: paths,
    });

    await postRepository.save(result);

    return Object({
      status: '00',
      ...result,
      images: result.images.split(', '),
    });
  }

  async listPosts({ limit, page: current_page }: ListPostsParams) {
    if (!(await postRepository.count())) {
      return Object({ data: [], total: 0, current_page: 0 });
    }

    let [data, count] = await postRepository.findAndCount({
      take: Number(limit),
      skip: Number(current_page) * Number(limit),
    });

    data = data.map((item) =>
      Object({ ...item, images: item.images.split(', ') })
    );

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
    images.length &&
      (post.images =
        post.images +
        ', ' +
        images
          .map(
            (image: any) =>
              `${
                process.env.APP_HOST.includes('localhost')
                  ? process.env.APP_HOST + ':' + process.env.APP_PORT
                  : process.env.APP_HOST
              }/${image.path}`
          )
          .join(', '));

    await postRepository.save(post);

    return Object({
      status: '00',
      data: { ...post, images: post.images.split(', ') },
    });
  }
}
