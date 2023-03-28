import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ClientDefinition } from '../../domain';
import {
  createClient,
  createDeserializedObject,
  createSerializedObject,
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
      (source) => ({ ...source }),
      (target) => {
        if (typeof target.api !== 'string') return false;
        if (target.api !== 'http' && target.api !== 'rpc') return false;
        if (typeof target.hostname !== 'string') return false;
        if (!target.hostname) return false;
        if (!Number.isInteger(target.port)) return false;
        if (target.port <= 0 || target.port >= 65536) return false;
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
    const client = await createSerializedObject(() =>
      createClient(token, setup),
    );
    if (!client) {
      return {
        code: 500,
        body: {
          success: false,
        },
      };
    }
    return {
      code: 201,
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
      if (req.secret !== readSecret()) {
        return {
          success: false,
        };
      }
      const token = req.token;
      const setup = await createDeserializedObject(
        () => req.setup,
        (source) => ({ ...source }),
        (target) => {
          if (target.api !== 'http' && target.api !== 'rpc') return false;
          if (!target.hostname) return false;
          if (target.port <= 0 || target.port >= 65536) return false;
          return true;
        },
      );
      if (!token || !setup) {
        return {
          success: false,
        };
      }
      const client = await createSerializedObject(() =>
        createClient(token, setup),
      );
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
