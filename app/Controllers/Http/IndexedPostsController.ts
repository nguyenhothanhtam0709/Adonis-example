import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from 'App/Constants/Paginate';
import IndexedPost from 'App/Models/IndexedPost';
import QueryIndexedPostValidator from 'App/Validators/IndexedPosts/QueryIndexedPostValidator';

export default class IndexedPostsController {
  async index({ request }: HttpContextContract) {
    const {
      pageSize = DEFAULT_PAGE_SIZE,
      pageIndex = DEFAULT_PAGE_INDEX,
      search,
    } = await request.validate(QueryIndexedPostValidator);

    const posts = await IndexedPost.query()
      .whereRaw(`title match '${search}'`)
      .paginate(pageIndex, pageSize);
    return posts.toJSON();
  }
}
