import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from 'App/Constants/Paginate';
import QueryMyPostsValidator from 'App/Validators/Feeds/QueryMyPostsValidator';
import Post from 'App/Models/Post';
import QueryPostsByHashtagValidator from 'App/Validators/Feeds/QueryPostsByHashtagValidator';

export default class FeedsController {
  async myPosts({ request, auth }: HttpContextContract) {
    const id = auth?.user?.id!;
    const { pageSize = DEFAULT_PAGE_SIZE, pageIndex = DEFAULT_PAGE_INDEX } = await request.validate(
      QueryMyPostsValidator
    );
    const posts = await Post.query().where('userId', id).paginate(pageIndex, pageSize);

    return posts.toJSON();
  }

  async postsByHashtag({ request }: HttpContextContract) {
    const {
      pageSize = DEFAULT_PAGE_SIZE,
      pageIndex = DEFAULT_PAGE_INDEX,
      hashtags,
    } = await request.validate(QueryPostsByHashtagValidator);
    let query = Post.query()
      .preload('user', (builder) => builder.select(['id', 'email']))
      .preload('hashTags', (builder) => builder.select(['id', 'name', 'key']));

    const hashtagsArr = hashtags
      ? hashtags
          .split(',')
          .filter((i) => i)
          .map((i) => Number(i.trim()))
      : [];

    if (hashtagsArr?.length) {
      query = query.with('hashTags', (query) => {
        query.whereIn('hash_tag_id', hashtagsArr);
      });
    }
    const posts = await query.paginate(pageIndex, pageSize);
    return posts.toJSON();
  }
}
