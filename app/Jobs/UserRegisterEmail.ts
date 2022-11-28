import { JobContract } from '@ioc:Rocketseat/Bull';
import Mail from '@ioc:Adonis/Addons/Mail';

/*
|--------------------------------------------------------------------------
| Job setup
|--------------------------------------------------------------------------
|
| This is the basic setup for creating a job, but you can override
| some settings.
|
| You can get more details by looking at the bullmq documentation.
| https://docs.bullmq.io/
*/

export default class UserRegisterEmail implements JobContract {
  public key = 'UserRegisterEmail';

  public concurrency = 1;

  public async handle(job: UserRegisterEmailJobProps) {
    const { data } = job;
    // Do somethign with you job data
    await Mail.use('smtp').send(
      (message) => {
        message
          .from('info@example.com')
          .to(data.email)
          .subject('Welcome!')
          .htmlView('emails/welcome', { name: data.email });
      },
      {
        transaction: true,
        openTracking: false,
      }
    );
  }
}

type UserRegisterEmailJobProps = {
  data: UserRegisterEmailData;
};

type UserRegisterEmailData = {
  email: string;
  data?: string;
};
