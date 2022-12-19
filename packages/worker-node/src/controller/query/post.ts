import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { QueryDefinition, QueryPrivilege } from './proto';
import { adapterMapper, type AdapterTypeAlias } from '../../domain';
import { createQuery } from '../../service';

const privilegeMapper: Record<
  QueryPrivilege.READ | QueryPrivilege.WRITE | QueryPrivilege.ROOT,
  'read' | 'write' | 'root'
> = {
  [QueryPrivilege.READ]: 'read',
  [QueryPrivilege.WRITE]: 'write',
  [QueryPrivilege.ROOT]: 'root',
};

const postQueryByHttp: Route = {
  method: 'POST',
  pathname: '/query',
  handler: async (req) => {
    const { url, body } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const adapterType = adapterMapper[Number(type) as AdapterTypeAlias];
    const privilege = Number(
      `/${url.pathname}/`
        .replace(/\/+/g, '/')
        .match(/^\/query\/(0|1|2)\//)?.[1],
    );
    const query = await body.text();
    if (
      Number(!name) ^ Number(privilege === QueryPrivilege.ROOT) ||
      !adapterType ||
      (privilege !== QueryPrivilege.READ &&
        privilege !== QueryPrivilege.WRITE &&
        privilege !== QueryPrivilege.ROOT) ||
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
    const result = await createQuery(
      adapterType,
      name || '',
      privilegeMapper[privilege],
      query,
    );
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
  },
};

const postQueryByRpc: Plugin<QueryDefinition> = {
  definition: QueryDefinition,
  handlers: {
    postQuery: async (req) => {
      const { name, privilege, query, type } = req;
      const adapterType = adapterMapper[type as AdapterTypeAlias];
      if (
        Number(!name) ^ Number(privilege === QueryPrivilege.ROOT) ||
        !adapterType ||
        (privilege !== QueryPrivilege.READ &&
          privilege !== QueryPrivilege.WRITE &&
          privilege !== QueryPrivilege.ROOT) ||
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
        privilegeMapper[privilege],
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

export { postQueryByHttp, postQueryByRpc };
