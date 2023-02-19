import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ClientDefinition } from '../../domain';
import {
  createSerializedObject,
  deleteClient,
  readSecret,
} from '../../service';

const deleteClientByHttp: Route = {
  method: 'DELETE',
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
    if (!token) {
      return {
        code: 400,
        body: {
          success: false,
        },
      };
    }
    const client = await createSerializedObject(() => deleteClient(token));
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

const deleteClientByRpc: Plugin<ClientDefinition> = {
  definition: ClientDefinition,
  handlers: {
    deleteClient: async (req) => {
      if (req.secret !== readSecret()) {
        return {
          success: false,
        };
      }
      const token = req.token;
      if (!token) {
        return {
          success: false,
        };
      }
      const client = await createSerializedObject(() => deleteClient(token));
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

export { deleteClientByHttp, deleteClientByRpc };
