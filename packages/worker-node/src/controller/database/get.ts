import { type Plugin } from '@dest-toolkit/grpc-server';
import { type PluginHandler as HttpHandler } from '@dest-toolkit/http-server';
import {
  DatabaseDefinition,
  type BaseRequest,
  type DataResponse,
} from './proto';
import {
  adapterMapper,
  type AdapterType,
  type AdapterTypeAlias,
} from '../../domain';
import { readDatabase } from '../../service';

const httpHandler: HttpHandler = async (req) => {
  const { url } = req;
  const name = url.searchParams.get('name');
  const type = url.searchParams.get('type');
  const adapterType = adapterMapper[type as AdapterType | AdapterTypeAlias];
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
};

const rpc: Plugin<'UNARY', BaseRequest, DataResponse> = {
  service: DatabaseDefinition.fullName,
  method: {
    ...DatabaseDefinition.methods.getDatabase,
    handler: async (req) => {
      const { name, type } = req;
      const adapterType = adapterMapper[type as AdapterType | AdapterTypeAlias];
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

export { httpHandler, rpc };
