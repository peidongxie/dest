import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { DatabaseDefinition, type AdapterType } from '../../domain';
import { deleteDatabase, readMemo } from '../../service';

const deleteDatabaseByHttp: Route = {
  method: 'DELETE',
  pathname: '/database',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret');
    if ((secret || '') !== (readMemo<string>(['secret']) || '')) {
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
    const adapterType = Number(type)
      ? readMemo<AdapterType>(['type', Number(type)])
      : '';
    if (!adapterType || !name) {
      return {
        code: 400,
        body: {
          success: false,
        },
      };
    }
    const scheduler = await deleteDatabase(adapterType, name);
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

const deleteDatabaseByRpc: Plugin<DatabaseDefinition> = {
  definition: DatabaseDefinition,
  handlers: {
    deleteDatabase: async (req) => {
      const { secret } = req;
      if ((secret || '') !== (readMemo<string>(['secret']) || '')) {
        return {
          success: false,
        };
      }
      const { name, type } = req;
      const adapterType = type ? readMemo<AdapterType>(['type', type]) : '';
      if (!adapterType || !name) {
        return {
          success: false,
        };
      }
      const scheduler = await deleteDatabase(adapterType, name);
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

export { deleteDatabaseByHttp, deleteDatabaseByRpc };
