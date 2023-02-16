import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { QueryDefinition, type ActionEnum } from '../../domain';
import {
  createDeserializedObject,
  createQuery,
  createSerializedObject,
  readAction,
  readSecret,
  readType,
} from '../../service';

const postQueryByHttp: Route = {
  method: 'POST',
  pathname: '/query',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret') || '';
    if (secret !== readSecret()) {
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
    const { body, url } = req;
    const name = url.searchParams.get('name') || '';
    const type = url.searchParams.get('type') || '';
    const event = await body.json<{
      action: ActionEnum;
      target: string;
      values: unknown[];
    }>();
    const adapterType = readType(type);
    const databaseEvent = createDeserializedObject(
      event,
      (source) => {
        const action = readAction(source.action);
        if (!action) return null;
        return {
          ...source,
          action,
        };
      },
      (target) => {
        if (typeof target.target !== 'string') return false;
        if (!Array.isArray(target.values)) return false;
        return true;
      },
    );
    if (
      !adapterType ||
      !databaseEvent ||
      (!name && databaseEvent.action !== 'root') ||
      (name && databaseEvent.action === 'root')
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
    const promise = createQuery(adapterType, name, databaseEvent);
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
      if (secret !== readSecret()) {
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
      const adapterType = readType(type);
      const databaseEvent = createDeserializedObject(
        event,
        (source) => {
          const action = readAction(source.action);
          if (!action) return null;
          const values = source.values.map((value) => JSON.parse(value));
          return {
            ...source,
            action,
            values,
          };
        },
        () => true,
      );
      if (
        !adapterType ||
        !databaseEvent ||
        (!name && databaseEvent.action !== 'root') ||
        (name && databaseEvent.action === 'root')
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
      const promise = createQuery(adapterType, name, databaseEvent);
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
      const result = createSerializedObject(
        await promise,
        (source, stringifier) => ({
          ...source,
          rows: source.rows.map(stringifier),
        }),
      );
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
        result,
      };
    },
  },
};

export { postQueryByHttp, postQueryByRpc };
