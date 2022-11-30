import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BasePaginateSchema from '../Schema/PaginateSchema';

export default class QueryPostsByHashtagValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    ...BasePaginateSchema,
    hashtags: schema.string.optional([rules.minLength(1), rules.regex(/^[0-9,]+$/)]),
  });
}
