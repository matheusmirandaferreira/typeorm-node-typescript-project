import { AppDataSource } from '../database';
import { Post } from '../models';
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

    return Object({ ...result, images: result.images.split(', ') });
  }

  async listPosts({ limit, page: current_page }: ListPostsParams) {
    if (!postRepository.metadata.indices.length) {
      return Object({ data: [], total: 0, current_page: 0 });
    }

    const [data, count] = await postRepository.findAndCount({
      take: Number(limit),
      skip: Number(current_page) * Number(limit),
    });

    return Object({ data, total: count, current_page });
  }
}
