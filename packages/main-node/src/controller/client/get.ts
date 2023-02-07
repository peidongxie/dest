import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ClientDefinition } from '../../domain';
import { readClient, readSecret } from '../../service';

const getClientByHttp: Route = {
  method: 'GET',
  pathname: '/client',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret');
    if ((secret || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
          setup: {
            api: '',
            hostname: '',
            port: 0,
          },
        },
      };
    }
    const { url } = req;
    const token = url.searchParams.get('token');
    if (!token) {
      return {
        code: 400,
        body: {
          success: false,
          setup: {
            api: '',
            hostname: '',
            port: 0,
          },
        },
      };
    }
    const client = await readClient(token);
    if (!client) {
      return {
        code: 404,
        body: {
          success: false,
          setup: {
            api: '',
            hostname: '',
            port: 0,
          },
        },
      };
    }
    return {
      code: 200,
      body: {
        success: true,
        setup: client.getSetup(),
      },
    };
  },
};

const getClientByRpc: Plugin<ClientDefinition> = {
  definition: ClientDefinition,
  handlers: {
    getClient: async (req) => {
      const { secret } = req;
      if ((secret || '') !== readSecret()) {
        return {
          success: false,
          setup: {
            api: '',
            hostname: '',
            port: 0,
          },
        };
      }
      const { token } = req;
      if (!token) {
        return {
          success: false,
          setup: {
            api: '',
            hostname: '',
            port: 0,
          },
        };
      }
      const client = await readClient(token);
      if (!client) {
        return {
          success: false,
          setup: {
            api: '',
            hostname: '',
            port: 0,
          },
        };
      }
      return {
        success: true,
        setup: client.getSetup(),
      };
    },
  },
};

export { getClientByHttp, getClientByRpc };
