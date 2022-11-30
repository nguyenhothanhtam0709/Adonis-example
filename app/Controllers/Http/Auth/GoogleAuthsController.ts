import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { OAuth2Client, LoginTicket } from 'google-auth-library';
import Env from '@ioc:Adonis/Core/Env';
import { Exception } from '@adonisjs/core/build/standalone';
import User from 'App/Models/User';
import { GoogleTokenInfoPayload } from 'App/Types/Auth/GoogleAuth';

const googleClient = new OAuth2Client({
  clientId: Env.get('GOOGLE_CLIENT_ID'),
  clientSecret: Env.get('GOOGLE_CLIENT_SECRET'),
  redirectUri: Env.get('GOOGLE_CALLBACK_URL'),
});

export default class GoogleAuthsController {
  async getUrl(_: HttpContextContract) {
    return googleClient.generateAuthUrl({
      scope: ['email', 'profile'],
    });
  }

  async getToken({ request }: HttpContextContract) {
    try {
      const code = request.qs()['code'];
      const tokenResponse = await googleClient.getToken(code);
      return {
        accessToken: tokenResponse.tokens.access_token,
        idToken: tokenResponse.tokens.id_token,
      };
    } catch (e) {
      throw new Exception(
        JSON.stringify({
          message: 'Code is incorrect',
          messageCode: 'GOOGLE_CODE_INCORRECT',
        }),
        400
      );
    }
  }

  async login({ request, auth }: HttpContextContract) {
    const token = request.body()['token'];
    const googleTokenInfo = await this.verify(token);

    let user = await User.findBy('email', googleTokenInfo.email);
    if (!user) {
      user = await User.create({
        email: googleTokenInfo.email,
        password: googleTokenInfo.email,
      });
    }
    const autToken = await auth.use('api').login(user, {
      expiresIn: Env.get('AUTH_TOKEN_EXPIRE'),
    });
    return autToken.toJSON();
  }

  private async verify(idToken: string): Promise<GoogleTokenInfoPayload> {
    try {
      const clientId = [Env.get('GOOGLE_CLIENT_ID')];
      const response: LoginTicket = await googleClient.verifyIdToken({
        idToken,
        audience: clientId,
      });
      return response.getPayload() as GoogleTokenInfoPayload;
    } catch (e) {
      console.log(e);
      throw new Exception(
        JSON.stringify({
          message: 'Code is incorrect',
          messageCode: 'GOOGLE_CODE_INCORRECT',
        }),
        404
      );
    }
  }
}
