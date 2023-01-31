import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { DatabaseDefinition, type AdapterType } from '../../domain';
import { readDatabase, readMemo } from '../../service';

const getDatabaseByHttp: Route = {
  method: 'GET',
  pathname: '/database',
  handler: async (req) => {
    const { url } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const adapterType = readMemo<AdapterType>(['type', Number(type)]);
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
    return {
      code: 200,
      body: {
        success: true,
        schemas: scheduler.getTarget().getSchemas(),
      },
    };
  },
};

const getDatabaseByRpc: Plugin<DatabaseDefinition> = {
  definition: DatabaseDefinition,
  handlers: {
    getDatabase: async (req) => {
      const { name, type } = req;
      const adapterType = readMemo<AdapterType>(['type', type]);
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
      return {
        success: true,
        schemas: scheduler
          .getTarget()
          .getSchemas()
          .map((schema) => JSON.stringify(schema)),
      };
    },
  },
};

export { getDatabaseByHttp, getDatabaseByRpc };
