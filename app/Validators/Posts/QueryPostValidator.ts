import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BasePaginateSchema from '../Schema/PaginateSchema';

export default class QueryPostsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    ...BasePaginateSchema,
    title: schema.string.optional({ trim: true }, [rules.minLength(3)]),
    userId: schema.number.optional([rules.unsigned()]),
  });

  // public messages: CustomMessages = {
  //   'title.required': 'Title is required',
  // };
}
