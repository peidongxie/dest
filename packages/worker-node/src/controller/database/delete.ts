import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { DatabaseDefinition } from './proto';
import { adapterMapper, type AdapterTypeAlias } from '../../domain';
import { deleteDatabase } from '../../service';

const http: Route = {
  method: 'DELETE',
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
        },
      };
    }
    const database = await deleteDatabase(adapterType, name);
    if (!database) {
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

const rpc: Plugin<DatabaseDefinition> = {
  definition: DatabaseDefinition,
  handlers: {
    deleteDatabase: async (req) => {
      const { name, type } = req;
      const adapterType = adapterMapper[type as AdapterTypeAlias];
      if (!name || !adapterType) {
        return {
          success: false,
        };
      }
      const database = await deleteDatabase(adapterType, name);
      if (!database) {
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

export { http, rpc };
