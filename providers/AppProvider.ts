import type { ApplicationContract } from '@ioc:Adonis/Core/Application';
import type {
  OutgoingHttpHeaders,
  OutgoingHttpHeader,
  ServerResponse,
  IncomingMessage,
} from 'http';

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    const { DatabaseQueryBuilder, ModelQueryBuilder } =
      this.app.container.use('Adonis/Lucid/Database');

    DatabaseQueryBuilder.macro('getCount', async function () {
      const result = await this.count('* as total');
      return BigInt(result[0].total);
    });

    ModelQueryBuilder.macro('getCount', async function () {
      const result = await this.count('* as total');
      return BigInt(result[0].$extras.total);
    });

    const Response = this.app.container.use('Adonis/Core/Response');
    Response.macro(
      'write',
      function (chunk: any, callback?: ((error: Error | null | undefined) => void) | undefined) {
        return this.response.write(chunk, callback);
      }
    );
    Response.macro(
      'writeHead',
      function (
        statusCode: number,
        headers?: OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined
      ): ServerResponse<IncomingMessage> {
        return this.response.writeHead(statusCode, headers);
      }
    );
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
