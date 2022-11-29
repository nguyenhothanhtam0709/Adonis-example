import type {
  OutgoingHttpHeaders,
  OutgoingHttpHeader,
  ServerResponse,
  IncomingMessage,
} from 'http';

declare module '@ioc:Adonis/Core/Response' {
  interface ResponseContract {
    write(chunk: any, callback?: ((error: Error | null | undefined) => void) | undefined): boolean;

    writeHead(
      statusCode: number,
      headers?: OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined
    ): ServerResponse<IncomingMessage>;
  }
}
