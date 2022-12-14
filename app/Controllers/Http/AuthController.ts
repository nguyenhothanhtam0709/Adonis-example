import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import LoginValidator from 'App/Validators/Auth/LoginValidator';
import RegisterValidator from 'App/Validators/Auth/RegisterValidator';
import Env from '@ioc:Adonis/Core/Env';
// import Redis from '@ioc:Adonis/Addons/Redis';
import Bull from '@ioc:Rocketseat/Bull';
import Job from 'App/Jobs/NewUserRegisterTracking';
import UserRegisterEmailJob from 'App/Jobs/UserRegisterEmail';
// import Database from '@ioc:Adonis/Lucid/Database';

export default class AuthController {
  async login({ request, auth }: HttpContextContract) {
    // const count = await Database.query().from('users').getCount();
    // const count = await User.query().getCount();
    // return count;

    const validated = await request.validate(LoginValidator);

    /**
     * "attempt" method lookups the user from the database and verifies their password, then generate token
     */
    const token = await auth.use('api').attempt(validated.email, validated.password, {
      expiresIn: Env.get('AUTH_TOKEN_EXPIRE'),
    });

    return token.toJSON();
  }

  async register({ request, auth }: HttpContextContract) {
    const validated = await request.validate(RegisterValidator);

    const newUser = await User.create(validated);
    const token = await auth.use('api').login(newUser, {
      expiresIn: Env.get('AUTH_TOKEN_EXPIRE'),
    });

    Bull.add(new Job().key, newUser);
    Bull.add(new UserRegisterEmailJob().key, { email: newUser.email });

    return token.toJSON();
  }

  async logout({ auth, i18n }: HttpContextContract) {
    await auth.use('api').revoke();
    const message = i18n.formatMessage('auth.logout.successful');

    return {
      message,
    };
  }

  async profile({ auth, logger }: HttpContextContract) {
    logger.info(`User ${auth?.user?.id} get profile`);
    logger.info(auth.user?.toJSON() as any);
    return auth.user?.toJSON();
  }
}
