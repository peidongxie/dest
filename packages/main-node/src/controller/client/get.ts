import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ClientDefinition } from '../../domain';
import { createSerializedObject, readClient, readSecret } from '../../service';

const getClientByHttp: Route = {
  method: 'GET',
  pathname: '/client',
  handler: async (req) => {
    if ((req.url.searchParams.get('secret') || '') !== readSecret()) {
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
    const token = req.url.searchParams.get('token') || '';
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
    const client = await createSerializedObject(() => readClient(token));
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
      if (req.secret !== readSecret()) {
        return {
          success: false,
          setup: {
            api: '',
            hostname: '',
            port: 0,
          },
        };
      }
      const token = req.token;
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
      const client = await createSerializedObject(() => readClient(token));
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
