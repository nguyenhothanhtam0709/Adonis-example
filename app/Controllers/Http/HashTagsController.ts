import { Exception } from '@adonisjs/core/build/standalone';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from 'App/Constants/Paginate';
import HashTag from 'App/Models/HashTag';
import CreateHashTagsValidator from 'App/Validators/HashTags/CreateHashTagsValidator';
import QueryHashTagsValidator from 'App/Validators/HashTags/QueryHashTagsValidator';

export default class HashTagsController {
  async index({ request }: HttpContextContract) {
    const { pageSize = DEFAULT_PAGE_SIZE, pageIndex = DEFAULT_PAGE_INDEX } = await request.validate(
      QueryHashTagsValidator
    );
    const posts = await HashTag.query().paginate(pageIndex, pageSize);
    return posts.toJSON();
  }

  async store({ request }: HttpContextContract) {
    const validated = await request.validate(CreateHashTagsValidator);
    await HashTag.create(validated);
    return {
      success: true,
    };
  }

  async delete({ params }: HttpContextContract) {
    const id: number = params.id!;
    const hashTag = await HashTag.findBy('id', id);
    if (!hashTag) {
      throw new Exception('Hashtag not found', 404);
    }
    await hashTag.delete();
    return {
      success: true,
    };
  }
}
