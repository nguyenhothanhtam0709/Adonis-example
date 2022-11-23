import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreatePostsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }, [rules.minLength(6)]),
    content: schema.string({ trim: true }, [rules.nullable()]),
    hashTagIds: schema.array
      .optional([rules.minLength(1)])
      .members(schema.number([rules.unsigned()])),
  });

  public messages: CustomMessages = {
    'title.required': 'Title is required',
  };
}
