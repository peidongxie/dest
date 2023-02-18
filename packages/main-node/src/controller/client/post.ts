import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ClientDefinition } from '../../domain';
import {
  createClient,
  createDeserializedObject,
  readSecret,
} from '../../service';

const postClientByHttp: Route = {
  method: 'POST',
  pathname: '/client',
  handler: async (req) => {
    if ((req.url.searchParams.get('secret') || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
        },
      };
    }
    const token = req.url.searchParams.get('token') || '';
    const setup = await createDeserializedObject(
      () =>
        req.body.json<{
          api: 'http' | 'rpc';
          hostname: string;
          port: number;
        }>(),
      (source) => source,
      (target) => {
        if (target.api !== 'http' && target.api !== 'rpc') return false;
        if (typeof target.hostname !== 'string') return false;
        if (typeof target.port !== 'number') return false;
        return true;
      },
    );
    if (!token || !setup) {
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
      if (secret !== readSecret()) {
        return {
          success: false,
        };
      }
      const token = req.token;
      const setup = await createDeserializedObject(
        () => req.setup,
        (source) => source,
        (target) => {
          if (target.api !== 'http' && target.api !== 'rpc') return false;
          return true;
        },
      );
      if (!token || !setup) {
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
