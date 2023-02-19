import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ContextDefinition } from '../../domain';
import {
  createSerializedObject,
  readContext,
  readEnum,
  readSecret,
  readType,
} from '../../service';

const getContextByHttp: Route = {
  method: 'GET',
  pathname: '/context',
  handler: async (req) => {
    if ((req.url.searchParams.get('secret') || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
          dataset: {
            schemas: [],
            events: [],
          },
        },
      };
    }
    const type = readType(req.url.searchParams.get('type'));
    const name = req.url.searchParams.get('name') || '';
    if (!type || !name) {
      return {
        code: 400,
        body: {
          success: false,
          dataset: {
            schemas: [],
            events: [],
          },
        },
      };
    }
    const dataset = await createSerializedObject(
      () => readContext(type, name)?.getTarget().getDataset() || null,
    );
    if (!dataset) {
      return {
        code: 404,
        body: {
          success: false,
          dataset: {
            schemas: [],
            events: [],
          },
        },
      };
    }
    return {
      code: 200,
      body: {
        success: true,
        dataset,
      },
    };
  },
};

const getContextByRpc: Plugin<ContextDefinition> = {
  definition: ContextDefinition,
  handlers: {
    getContext: async (req) => {
      if (req.secret !== readSecret()) {
        return {
          success: false,
          dataset: {
            schemas: [],
            events: [],
          },
        };
      }
      const type = readType(req.type);
      const name = req.name;
      if (!type || !name) {
        return {
          success: false,
          dataset: {
            schemas: [],
            events: [],
          },
        };
      }
      const dataset = await createSerializedObject(
        () => readContext(type, name)?.getTarget().getDataset() || null,
        (source, stringifier) => ({
          schemas: source.schemas.map(stringifier),
          events: source.events.map((event) => ({
            ...event,
            action: readEnum(event.action),
            values: event.values.map(stringifier),
          })),
        }),
      );
      if (!dataset) {
        return {
          success: false,
          dataset: {
            schemas: [],
            events: [],
          },
        };
      }
      return {
        success: true,
        dataset,
      };
    },
  },
};

export { getContextByHttp, getContextByRpc };
