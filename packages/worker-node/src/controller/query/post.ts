import { type Plugin } from '@dest-toolkit/grpc-server';
import { type PluginHandler as HttpHandler } from '@dest-toolkit/http-server';
import {
  QueryDefinition,
  type QueryRequest,
  type ResultResponse,
} from './proto';
import {
  adapterMapper,
  type AdapterType,
  type AdapterTypeAlias,
} from '../../domain';
import { createQuery } from '../../service';

const httpHandler: HttpHandler = async (req) => {
  const { url, body } = req;
  const name = url.searchParams.get('name');
  const type = url.searchParams.get('type');
  const adapterType = adapterMapper[type as AdapterType | AdapterTypeAlias];
  const privilege = `/${url.pathname}/`
    .replace(/\/+/g, '/')
    .match(/^\/query\/(read|root|write)\//)?.[1] as
    | 'read'
    | 'root'
    | 'write'
    | undefined;
  const query = await body.text();
  if (
    Number(!name) ^ Number(privilege === 'root') ||
    !adapterType ||
    (privilege !== 'read' && privilege !== 'root' && privilege !== 'write') ||
    !query
  ) {
    return {
      code: 400,
      body: {
        success: false,
        time: 0,
        result: '',
      },
    };
  }
  const result = await createQuery(adapterType, name || '', privilege, query);
  if (!result) {
    return {
      code: 404,
      body: {
        success: false,
        time: 0,
        result: '',
      },
    };
  }
  return {
    code: 201,
    body: {
      success: true,
      time: Number(result.time),
      result: result.result,
    },
  };
};

const rpc: Plugin<'UNARY', QueryRequest, ResultResponse> = {
  service: QueryDefinition.fullName,
  method: {
    ...QueryDefinition.methods.postQuery,
    handler: async (req) => {
      const { name, privilege, query, type } = req;
      const adapterType = adapterMapper[type as AdapterType | AdapterTypeAlias];
      if (
        Number(!name) ^ Number(privilege === 'root') ||
        !adapterType ||
        (privilege !== 'read' &&
          privilege !== 'root' &&
          privilege !== 'write') ||
        !query
      ) {
        return {
          success: false,
          time: 0,
          result: '',
        };
      }
      const result = await createQuery(
        adapterType,
        name || '',
        privilege,
        query,
      );
      if (!result) {
        return {
          success: false,
          time: 0,
          result: '',
        };
      }
      return {
        success: true,
        time: Number(result.time),
        result: JSON.stringify(result.result),
      };
    },
  },
};

export { httpHandler, rpc };
