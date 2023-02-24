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
    const type = readType(req.url.searchParams.get('type'));
    const name = req.url.searchParams.get('name') || '';
    const event = await createDeserializedObject(
      () =>
        req.body.json<{
          action: ActionEnum;
          target: string;
          values: unknown[];
        }>(),
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
      !type ||
      !event ||
      (!name && event.action !== 'root') ||
      (name && event.action === 'root')
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
    const promise = createQuery(type, name, event);
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
      if (req.secret !== readSecret()) {
        return {
          success: false,
          result: {
            time: 0,
            error: '',
            rows: [],
          },
        };
      }
      const type = readType(req.type);
      const name = req.name;
      const event = await createDeserializedObject(
        () => req.event,
        (source, parser) => {
          const action = readAction(source.action);
          if (!action) return null;
          const values = source.values.map(parser);
          return {
            ...source,
            action,
            values,
          };
        },
      );
      if (
        !type ||
        !event ||
        (!name && event.action !== 'root') ||
        (name && event.action === 'root')
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
      const promise = createQuery(type, name, event);
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
      const result = await createSerializedObject(
        async () => await promise,
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
