import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import CreatePostsValidator from 'App/Validators/Posts/CreatePostValidator';
import Post from 'App/Models/Post';
import UpdatePostsValidator from 'App/Validators/Posts/UpdatePostValidator';
import { Exception } from '@adonisjs/core/build/standalone';
import QueryPostsValidator from 'App/Validators/Posts/QueryPostValidator';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from 'App/Constants/Paginate';
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database';

export default class PostsController {
  async index({ request }: HttpContextContract) {
    const {
      pageSize = DEFAULT_PAGE_SIZE,
      pageIndex = DEFAULT_PAGE_INDEX,
      ...otherParams
    } = await request.validate(QueryPostsValidator);

    let query = Post.query();
    if (otherParams.userId) {
      query = query.where('userId', otherParams.userId);
    }
    if (otherParams.title) {
      query = query.whereLike('title', `%${otherParams.title}%`);
    }
    const queryResult = await query
      .select(['id', 'title', 'content', 'userId'])
      .preload('user', (builder) => builder.select(['id', 'email']))
      .preload('hashTags', (builder) => builder.select(['id', 'name', 'key']))
      .paginate(pageIndex!, pageSize!);
    return queryResult.toJSON();
  }

  async show({ params }: HttpContextContract) {
    const id = params.id as number;
    const post = await this.findById(id);
    await post.load((loader) => {
      loader.load('hashTags', (builder) => builder.select(['id', 'name', 'key']));
    });
    return post;
  }

  async store({ request, auth }: HttpContextContract) {
    const { title, content, hashTagIds } = await request.validate(CreatePostsValidator);
    const userId = auth?.user?.id as any;
    const post = await Database.transaction(
      async (trx: TransactionClientContract) => {
        const post = await Post.create(
          {
            title,
            content,
            userId,
          },
          {
            client: trx,
          }
        );

        if (hashTagIds?.length) {
          await post.useTransaction(trx).related('hashTags').attach(hashTagIds);
        }

        return post;
      },
      {
        isolationLevel: 'read committed',
      }
    );

    return post;
  }

  async update({ params, request, auth }: HttpContextContract) {
    const id = params.id as number;
    const updatePost = await this.findById(id);
    if (updatePost.userId !== auth?.user?.id) {
      throw new Exception('Unauthorized', 401);
    }
    const validatedData = await request.validate(UpdatePostsValidator);
    updatePost.title = validatedData.title;
    updatePost.content = validatedData.content;

    await Database.transaction(
      async (trx: TransactionClientContract) => {
        await updatePost.useTransaction(trx).save();

        await updatePost.useTransaction(trx).related('hashTags').detach();
        validatedData?.hashTagIds?.length &&
          (await updatePost
            .useTransaction(trx)
            .related('hashTags')
            .attach(validatedData.hashTagIds));
      },
      {
        isolationLevel: 'read committed',
      }
    );

    return {
      success: true,
    };
  }

  async destroy({ params, auth }: HttpContextContract) {
    const id = params.id as number;
    const post = await this.findById(id);
    if (post.userId !== auth?.user?.id) {
      throw new Exception('Unauthorized', 401);
    }
    await post.delete();

    return {
      success: true,
    };
  }

  private async findById(id: number): Promise<Post> {
    const post = await Post.findBy('id', id);
    if (!post) {
      throw new Exception('Post not found', 404);
    }

    return post;
  }
}
