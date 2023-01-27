import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import {
  EventAction,
  QueryDefinition,
  type AdapterType,
  type DatabaseAction,
} from '../../domain';
import { createQuery, readMemo } from '../../service';

const postQueryByHttp: Route = {
  method: 'POST',
  pathname: '/query',
  handler: async (req) => {
    const { url, body } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const baseType = readMemo<AdapterType>(['type', Number(type)]);
    const event = await body.json<{
      action: EventAction;
      target: string;
      values: unknown[];
      tables: string[];
    }>();
    const eventAction = readMemo<DatabaseAction>([
      'action',
      Number(event?.action),
    ]);
    if (
      Number(!name) ^ Number(event?.action === EventAction.ROOT) ||
      !baseType ||
      !eventAction ||
      !event ||
      !event.action ||
      !event.target ||
      !Array.isArray(event.values) ||
      !Array.isArray(event.tables)
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
    const promise = createQuery(baseType, name || '', {
      ...event,
      action: eventAction,
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
      const { event, name, type } = req;
      const baseType = readMemo<AdapterType>(['type', type]);
      const eventAction = readMemo<DatabaseAction>([
        'action',
        event?.action || 0,
      ]);
      if (
        Number(!name) ^ Number(event?.action === EventAction.ROOT) ||
        !baseType ||
        !eventAction ||
        !event ||
        !event.action ||
        !event.target ||
        !Array.isArray(event.values) ||
        !Array.isArray(event.tables)
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
      const promise = createQuery(baseType, name || '', {
        ...event,
        action: eventAction,
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
