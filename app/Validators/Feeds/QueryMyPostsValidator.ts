import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BasePaginateSchema from '../Schema/PaginateSchema';

export default class QueryMyPostsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    ...BasePaginateSchema,
  });
}
