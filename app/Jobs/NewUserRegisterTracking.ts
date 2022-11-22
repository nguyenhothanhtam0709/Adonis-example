import { JobContract } from '@ioc:Rocketseat/Bull';
import { JobsOptions } from 'bullmq';
import Logger from '@ioc:Adonis/Core/Logger';

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

export default class NewUserRegisterTracking implements JobContract {
  public key = 'NewUserRegisterTracking';

  public options: JobsOptions = {};

  public concurrency = 1;

  public async handle(job) {
    const { data } = job;
    // Do somethign with you job data
    Logger.info(data, 'New user registered');
  }
}
