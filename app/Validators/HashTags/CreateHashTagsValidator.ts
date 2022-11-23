import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreateHashTagsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.minLength(6)]),
    key: schema.string({ trim: true }, [rules.minLength(6)]),
    parentId: schema.number.optional([rules.unsigned()]),
  });

  public messages: CustomMessages = {
    'name.required': 'Name is required',
    'key.required': 'Key is required',
  };
}
