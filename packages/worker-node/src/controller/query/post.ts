import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import {
  EventAction,
  QueryDefinition,
  type AdapterType,
  type DatabaseAction,
} from '../../domain';
import { createCommonQuery, readMemo } from '../../service';

const postQueryByHttp: Route = {
  method: 'POST',
  pathname: '/query',
  handler: async (req) => {
    const { url, body } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const baseType = readMemo<AdapterType>(['type', type || '']);
    const event = await body.json<{
      action: EventAction;
      target: string;
      values: unknown[];
    }>();
    const eventAction = readMemo<DatabaseAction>([
      'action',
      event?.action || '',
    ]);
    if (
      Number(!name) ^ Number(event?.action === EventAction.ROOT) ||
      !baseType ||
      !eventAction ||
      !event ||
      !event.action ||
      !event.target ||
      !Array.isArray(event.values)
    ) {
      return {
        code: 400,
        body: {
          success: false,
          result: {
            time: 0,
            table: '',
            rows: [],
          },
        },
      };
    }
    const promise = createCommonQuery(
      baseType,
      name || '',
      eventAction,
      event.target,
      event.values,
    );
    if (!promise) {
      return {
        code: 404,
        body: {
          success: false,
          result: {
            time: 0,
            table: '',
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
            table: '',
            rows: [],
          },
        },
      };
    }
    return {
      code: 201,
      body: {
        success: true,
        result: result,
      },
    };
  },
};

const postQueryByRpc: Plugin<QueryDefinition> = {
  definition: QueryDefinition,
  handlers: {
    postQuery: async (req) => {
      const { event, name, type } = req;
      const baseType = readMemo<AdapterType>(['type', type || '']);
      const eventAction = readMemo<DatabaseAction>([
        'action',
        event?.action || '',
      ]);
      if (
        Number(!name) ^ Number(event?.action === EventAction.ROOT) ||
        !baseType ||
        !eventAction ||
        !event ||
        !event.action ||
        !event.target ||
        !Array.isArray(event.values)
      ) {
        return {
          success: false,
          result: {
            time: 0,
            table: '',
            rows: [],
          },
        };
      }
      const promise = createCommonQuery(
        baseType,
        name || '',
        eventAction,
        event.target,
        event.values.map((value) => JSON.parse(value)),
      );
      if (!promise) {
        return {
          success: false,
          result: {
            time: 0,
            table: '',
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
            table: '',
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
