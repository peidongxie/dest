import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { DatabaseDefinition } from '../../domain';
import {
  createSerializedObject,
  readDatabase,
  readSecret,
  readType,
} from '../../service';

const getDatabaseByHttp: Route = {
  method: 'GET',
  pathname: '/database',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret') || '';
    if (secret !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
          schemas: [],
        },
      };
    }
    const { url } = req;
    const name = url.searchParams.get('name') || '';
    const type = url.searchParams.get('type') || '';
    const adapterType = readType(type);
    if (!adapterType || !name) {
      return {
        code: 400,
        body: {
          success: false,
          schemas: [],
        },
      };
    }
    const scheduler = readDatabase(adapterType, name);
    if (!scheduler) {
      return {
        code: 404,
        body: {
          success: false,
          schemas: [],
        },
      };
    }
    const schemas = scheduler.getTarget().getSchemas();
    return {
      code: 200,
      body: {
        success: true,
        schemas,
      },
    };
  },
};

const getDatabaseByRpc: Plugin<DatabaseDefinition> = {
  definition: DatabaseDefinition,
  handlers: {
    getDatabase: async (req) => {
      const { secret } = req;
      if (secret !== readSecret()) {
        return {
          success: false,
          schemas: [],
        };
      }
      const { name, type } = req;
      const adapterType = readType(type);
      if (!adapterType || !name) {
        return {
          success: false,
          schemas: [],
        };
      }
      const scheduler = readDatabase(adapterType, name);
      if (!scheduler) {
        return {
          success: false,
          schemas: [],
        };
      }
      const schemas = createSerializedObject(
        scheduler.getTarget().getSchemas(),
        (source, stringifier) => source.map(stringifier),
      );
      if (!schemas) {
        return {
          success: false,
          schemas: [],
        };
      }
      return {
        success: true,
        schemas,
      };
    },
  },
};

export { getDatabaseByHttp, getDatabaseByRpc };
