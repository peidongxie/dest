import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ClientDefinition } from '../../domain';
import { createClient, readSecret } from '../../service';

const postClientByHttp: Route = {
  method: 'POST',
  pathname: '/client',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret');
    if ((secret || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
        },
      };
    }
    const { body, url } = req;
    const token = url.searchParams.get('token');
    const setup = await body.json<{
      api: 'http' | 'rpc';
      hostname: string;
      port: number;
    }>();
    if (
      !token ||
      !setup ||
      (setup.api !== 'http' && setup.api !== 'rpc') ||
      !setup.hostname ||
      !setup.port
    ) {
      return {
        code: 400,
        body: {
          success: false,
        },
      };
    }
    const client = await createClient(token, setup);
    if (!client) {
      return {
        code: 404,
        body: {
          success: false,
        },
      };
    }
    return {
      code: 200,
      body: {
        success: true,
      },
    };
  },
};

const postClientByRpc: Plugin<ClientDefinition> = {
  definition: ClientDefinition,
  handlers: {
    postClient: async (req) => {
      const { secret } = req;
      if ((secret || '') !== readSecret()) {
        return {
          success: false,
        };
      }
      const { setup, token } = req;
      if (
        !token ||
        !setup ||
        (setup.api !== 'http' && setup.api !== 'rpc') ||
        !setup.hostname ||
        !setup.port
      ) {
        return {
          success: false,
        };
      }
      const client = await createClient(token, setup);
      if (!client) {
        return {
          success: false,
        };
      }
      return {
        success: true,
      };
    },
  },
};

export { postClientByHttp, postClientByRpc };
