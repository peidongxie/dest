import { type Plugin } from '@dest-toolkit/grpc-server';
import { type PluginHandler as HttpHandler } from '@dest-toolkit/http-server';
import {
  DatabaseDefinition,
  type BaseResponse,
  type DataRequest,
} from './proto';
import {
  adapterMapper,
  type AdapterType,
  type AdapterTypeAlias,
} from '../../domain';
import { updateDatabase } from '../../service';

const httpHandler: HttpHandler = async (req) => {
  const { url, body } = req;
  const name = url.searchParams.get('name');
  const type = url.searchParams.get('type');
  const adapterType = adapterMapper[type as AdapterType | AdapterTypeAlias];
  const action = `/${url.pathname}/`
    .replace(/\/+/g, '/')
    .match(/^\/database\/(remove|save)\//)?.[1] as
    | 'remove'
    | 'save'
    | undefined;
  const data = await body.json<{ name: string; rows: unknown[] }[]>();
  if (
    !name ||
    !adapterType ||
    !action ||
    !Array.isArray(data) ||
    data.some((item) => {
      if (!item.name) return true;
      if (typeof item.name !== 'string') return true;
      if (!Array.isArray(item.rows)) return true;
      return false;
    })
  ) {
    return {
      code: 400,
      body: {
        success: false,
      },
    };
  }
  const database = await updateDatabase(adapterType, name, action, data);
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

const rpc: Plugin<'UNARY', DataRequest, BaseResponse> = {
  service: DatabaseDefinition.fullName,
  method: {
    ...DatabaseDefinition.methods.putDatabase,
    handler: async (req) => {
      const { action, data, name, type } = req;
      const adapterType = adapterMapper[type as AdapterType | AdapterTypeAlias];
      if (
        !adapterType ||
        !name ||
        (action !== 'remove' && action !== 'save') ||
        data.some((item) => {
          if (!item.name) return true;
          if (typeof item.name !== 'string') return true;
          if (!Array.isArray(item.rows)) return true;
          return false;
        })
      ) {
        return {
          success: false,
        };
      }
      const database = await updateDatabase(
        adapterType,
        name,
        action,
        data.map(({ name, rows }) => ({
          name,
          rows: rows.map((row) => JSON.parse(row)),
        })),
      );
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
