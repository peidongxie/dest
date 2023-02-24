import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { DatabaseDefinition } from '../../domain';
import { deleteDatabase, readSecret, readType } from '../../service';

const deleteDatabaseByHttp: Route = {
  method: 'DELETE',
  pathname: '/database',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret') || '';
    if (secret !== readSecret()) {
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
    const scheduler = await deleteDatabase(type, name);
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
      const scheduler = await deleteDatabase(type, name);
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
