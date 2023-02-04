import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import {
  QueryDefinition,
  type ActionEnum,
  type AdapterType,
  type DatabaseAction,
} from '../../domain';
import { createQuery, readMemo } from '../../service';

const postQueryByHttp: Route = {
  method: 'POST',
  pathname: '/query',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret');
    if ((secret || '') !== (readMemo<string>(['secret']) || '')) {
      return {
        code: 401,
        body: {
          success: false,
          result: {
            time: 0,
            error: '',
            rows: [],
          },
        },
      };
    }
    const { url, body } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const event = await body.json<{
      action: ActionEnum;
      target: string;
      values: unknown[];
      tables: string[];
    }>();
    const adapterType = Number(type)
      ? readMemo<AdapterType>(['type', Number(type)])
      : '';
    const databaseAction = Number(event?.action)
      ? readMemo<DatabaseAction>(['action', Number(event?.action)])
      : '';
    if (
      !adapterType ||
      (!name && databaseAction !== 'root') ||
      (name && databaseAction === 'root') ||
      !event ||
      !databaseAction ||
      !event.target ||
      !Array.isArray(event.values)
    ) {
      return {
        code: 400,
        body: {
          success: false,
          result: {
            time: 0,
            error: '',
            rows: [],
          },
        },
      };
    }
    const promise = createQuery(adapterType, name || '', {
      ...event,
      action: databaseAction,
    });
    if (!promise) {
      return {
        code: 404,
        body: {
          success: false,
          result: {
            time: 0,
            error: '',
            rows: [],
          },
        },
      };
    }
    const result = await promise;
    if (!result) {
      return {
        body: {
          success: false,
          result: {
            time: 0,
            error: '',
            rows: [],
          },
        },
      };
    }
    return {
      code: 201,
      body: {
        success: true,
        result,
      },
    };
  },
};

const postQueryByRpc: Plugin<QueryDefinition> = {
  definition: QueryDefinition,
  handlers: {
    postQuery: async (req) => {
      const { secret } = req;
      if ((secret || '') !== (readMemo<string>(['secret']) || '')) {
        return {
          success: false,
          result: {
            time: 0,
            error: '',
            rows: [],
          },
        };
      }
      const { event, name, type } = req;
      const adapterType = type ? readMemo<AdapterType>(['type', type]) : '';
      const databaseAction = Number(event?.action)
        ? readMemo<DatabaseAction>(['action', Number(event?.action)])
        : '';
      if (
        !adapterType ||
        (!name && databaseAction !== 'root') ||
        (name && databaseAction === 'root') ||
        !event ||
        !databaseAction ||
        !event.target ||
        !Array.isArray(event.values)
      ) {
        return {
          success: false,
          result: {
            time: 0,
            error: '',
            rows: [],
          },
        };
      }
      const promise = createQuery(adapterType, name || '', {
        ...event,
        action: databaseAction,
        values: event.values.map((value) => JSON.parse(value)),
      });
      if (!promise) {
        return {
          success: false,
          result: {
            time: 0,
            error: '',
            rows: [],
          },
        };
      }
      const result = await promise;
      if (!result) {
        return {
          success: false,
          result: {
            time: 0,
            error: '',
            rows: [],
          },
        };
      }
      return {
        success: true,
        result: {
          ...result,
          rows: result.rows.map((row) => JSON.stringify(row)),
        },
      };
    },
  },
};

export { postQueryByHttp, postQueryByRpc };
