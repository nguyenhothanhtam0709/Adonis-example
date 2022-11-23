import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from 'App/Constants/Paginate';
import QueryMyPostsValidator from 'App/Validators/Feeds/QueryMyPostsValidator';
import Post from 'App/Models/Post';

export default class FeedsController {
  async myPosts({ request, auth }: HttpContextContract) {
    const id = auth?.user?.id!;
    const { pageSize = DEFAULT_PAGE_SIZE, pageIndex = DEFAULT_PAGE_INDEX } = await request.validate(
      QueryMyPostsValidator
    );
    const posts = await Post.query().where('userId', id).paginate(pageIndex, pageSize);

    return posts.toJSON();
  }
}
