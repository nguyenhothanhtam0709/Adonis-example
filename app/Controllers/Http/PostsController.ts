import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import CreatePostsValidator from 'App/Validators/Posts/CreatePostValidator';
import Post from 'App/Models/Post';
import UpdatePostsValidator from 'App/Validators/Posts/UpdatePostValidator';
import { Exception } from '@adonisjs/core/build/standalone';
import QueryPostsValidator from 'App/Validators/Posts/QueryPostValidator';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from 'App/Constants/Paginate';

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
      .paginate(pageIndex!, pageSize!);
    return queryResult.toJSON();
  }

  show({ params }: HttpContextContract) {
    const id = params.id as number;
    return this.findById(id);
  }

  async store({ request, auth }: HttpContextContract) {
    const validatedData = await request.validate(CreatePostsValidator);
    const userId = auth?.user?.id as any;
    const newPost = await Post.create({
      ...validatedData,
      userId,
    });
    return newPost;
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
    await updatePost.save();

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
