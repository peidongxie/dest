import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { DatabaseDefinition } from './proto';
import { adapterMapper, type AdapterTypeAlias } from '../../domain';
import { readDatabase } from '../../service';

const http: Route = {
  method: 'GET',
  pathname: '/database',
  handler: async (req) => {
    const { url } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const adapterType = adapterMapper[Number(type) as AdapterTypeAlias];
    if (!name || !adapterType) {
      return {
        code: 400,
        body: {
          success: false,
          data: [],
        },
      };
    }
    const database = readDatabase(adapterType, name);
    if (!database) {
      return {
        code: 404,
        body: {
          success: false,
          data: [],
        },
      };
    }
    return {
      code: 200,
      body: {
        success: true,
        data: await database.snapshot(),
      },
    };
  },
};

const rpc: Plugin<DatabaseDefinition> = {
  definition: DatabaseDefinition,
  handlers: {
    getDatabase: async (req) => {
      const { name, type } = req;
      const adapterType = adapterMapper[type as AdapterTypeAlias];
      if (!name || !adapterType) {
        return {
          success: false,
          data: [],
        };
      }
      const database = readDatabase(adapterType, name);
      if (!database) {
        return {
          success: false,
          data: [],
        };
      }
      return {
        success: true,
        data: (await database.snapshot()).map(({ name, rows }) => ({
          name,
          rows: rows.map((row) => JSON.stringify(row)),
        })),
      };
    },
  },
};

export { http, rpc };
