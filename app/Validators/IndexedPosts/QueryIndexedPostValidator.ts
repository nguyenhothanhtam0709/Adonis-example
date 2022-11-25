import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BasePaginateSchema from '../Schema/PaginateSchema';

export default class QueryIndexedPostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    ...BasePaginateSchema,
    search: schema.string.optional({ trim: true }, [rules.minLength(3)]),
  });
}
