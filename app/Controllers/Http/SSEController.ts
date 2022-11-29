import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import type { ResponseContract } from '@ioc:Adonis/Core/Response';

type ClientInfo = {
  id: number;
  response: ResponseContract;
};

let clients: Array<ClientInfo> = [];
let facts: any[] = [
  {
    info: 'info 1',
    source: 'abc.com',
  },
];

const sendEventsToAll = async (newFact) => {
  clients.forEach((client) => client.response.write(`data: ${JSON.stringify(newFact)}\n\n`));
};

export default class SSEController {
  async getStatus() {
    return {
      clients: clients.length,
    };
  }

  /**
   * Server send event route
   */
  async getEvents({ request, response, logger }: HttpContextContract) {
    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'access-control-allow-origin': '*',
    });

    const data = `data: ${JSON.stringify(facts)}\n\n`;
    response.write(data);

    const clientId = Date.now();
    const newClient: ClientInfo = {
      id: clientId,
      response,
    };
    clients.push(newClient);

    request.request.on('close', () => {
      logger.info(`${clientId} Connection closed`);
      clients = clients.filter((client) => client.id !== clientId);
    });
  }

  async addFact({ request }: HttpContextContract) {
    const newFact = request.body();
    facts.push(newFact);
    sendEventsToAll(newFact);
    return newFact;
  }
}
