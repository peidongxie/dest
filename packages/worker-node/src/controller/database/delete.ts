import { type Plugin } from '@dest-toolkit/grpc-server';
import { type PluginHandler as HttpHandler } from '@dest-toolkit/http-server';
import {
  DatabaseDefinition,
  type BaseRequest,
  type BaseResponse,
} from './proto';
import {
  adapterMapper,
  type AdapterType,
  type AdapterTypeAlias,
} from '../../domain';
import { deleteDatabase } from '../../service';

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
};

const rpc: Plugin<'UNARY', BaseRequest, BaseResponse> = {
  service: DatabaseDefinition.fullName,
  method: {
    ...DatabaseDefinition.methods.deleteDatabase,
    handler: async (req) => {
      const { name, type } = req;
      const adapterType = adapterMapper[type as AdapterType | AdapterTypeAlias];
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

export { httpHandler, rpc };
