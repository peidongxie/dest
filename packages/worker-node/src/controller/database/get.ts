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
    const type = readType(req.url.searchParams.get('type'));
    const name = req.url.searchParams.get('name') || '';
    if (!type || !name) {
      return {
        code: 400,
        body: {
          success: false,
          schemas: [],
        },
      };
    }
    const schemas = await createSerializedObject(
      () => readDatabase(type, name)?.getTarget().getSchemas() || null,
    );
    if (!schemas) {
      return {
        code: 404,
        body: {
          success: false,
          schemas: [],
        },
      };
    }
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
      if (req.secret !== readSecret()) {
        return {
          success: false,
          schemas: [],
        };
      }
      const type = readType(req.type);
      const name = req.name;
      if (!type || !name) {
        return {
          success: false,
          schemas: [],
        };
      }
      const schemas = await createSerializedObject(
        () => readDatabase(type, name)?.getTarget().getSchemas() || null,
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
