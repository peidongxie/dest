import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ContextDefinition } from '../../domain';
import { deleteContext, readSecret, readType } from '../../service';

const deleteContextByHttp: Route = {
  method: 'DELETE',
  pathname: '/context',
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
    const { url } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const clientType = readType(type);
    if (!clientType || !name) {
      return {
        code: 400,
        body: {
          success: false,
        },
      };
    }
    const scheduler = await deleteContext(clientType, name);
    if (!scheduler) {
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

const deleteContextByRpc: Plugin<ContextDefinition> = {
  definition: ContextDefinition,
  handlers: {
    deleteContext: async (req) => {
      const { secret } = req;
      if ((secret || '') !== readSecret()) {
        return {
          success: false,
        };
      }
      const { name, type } = req;
      const clientType = readType(type);
      if (!clientType || !name) {
        return {
          success: false,
        };
      }
      const scheduler = await deleteContext(clientType, name);
      if (!scheduler) {
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

export { deleteContextByHttp, deleteContextByRpc };
