import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ContextDefinition } from '../../domain';
import { readContext, readEnum, readSecret, readType } from '../../service';

const getContextByHttp: Route = {
  method: 'GET',
  pathname: '/context',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret');
    if ((secret || '') !== readSecret()) {
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
    const { url } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const clientType = readType(type);
    if (!clientType || !name) {
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
    const scheduler = readContext(clientType, name);
    if (!scheduler) {
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
    const dataset = scheduler.getTarget().getDataset();
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
      const { secret } = req;
      if ((secret || '') !== readSecret()) {
        return {
          success: false,
          dataset: {
            schemas: [],
            events: [],
          },
        };
      }
      const { name, type } = req;
      const adapterType = readType(type);
      if (!adapterType || !name) {
        return {
          success: false,
          dataset: {
            schemas: [],
            events: [],
          },
        };
      }
      const scheduler = readContext(adapterType, name);
      if (!scheduler) {
        return {
          success: false,
          dataset: {
            schemas: [],
            events: [],
          },
        };
      }
      const dataset = scheduler.getTarget().getDataset();
      return {
        success: true,
        dataset: {
          schemas: dataset.schemas.map((schema) => JSON.stringify(schema)),
          events: dataset.events.map((event) => ({
            ...event,
            action: readEnum(event.action),
            values: event.values.map((value) => JSON.stringify(value)),
          })),
        },
      };
    },
  },
};

export { getContextByHttp, getContextByRpc };
