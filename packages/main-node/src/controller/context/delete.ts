import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ContextDefinition } from '../../domain';
import {
  createSerializedObject,
  deleteContext,
  readSecret,
  readType,
} from '../../service';

const deleteContextByHttp: Route = {
  method: 'DELETE',
  pathname: '/context',
  handler: async (req) => {
    if ((req.url.searchParams.get('secret') || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
        },
      };
    }
    const type = readType(req.url.searchParams.get('type'));
    const name = req.url.searchParams.get('name') || '';
    if (!type || !name) {
      return {
        code: 400,
        body: {
          success: false,
        },
      };
    }
    const scheduler = await createSerializedObject(() =>
      deleteContext(type, name),
    );
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
      if (req.secret !== readSecret()) {
        return {
          success: false,
        };
      }
      const type = readType(req.type);
      const name = req.name;
      if (!type || !name) {
        return {
          success: false,
        };
      }
      const scheduler = await createSerializedObject(() =>
        deleteContext(type, name),
      );
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
