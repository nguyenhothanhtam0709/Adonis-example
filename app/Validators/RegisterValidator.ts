import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.email()]),
    password: schema.string({ trim: true }, [rules.minLength(6)]),
  });

  public messages: CustomMessages = {
    'email.required': 'Email is required',
    'password.required': 'Password is requireds',
  };
}
