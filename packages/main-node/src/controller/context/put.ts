import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { type EntitySchemaOptions } from 'typeorm';
import { ContextDefinition, type ClientEvent } from '../../domain';
import {
  createDeserializedObject,
  readAction,
  readSecret,
  readType,
  updateContext,
} from '../../service';

const putContextByHttp: Route = {
  method: 'PUT',
  pathname: '/context',
  handler: async (req) => {
    if ((req.url.searchParams.get('secret') || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
        },
      };
    }
    const type = readType(req.url.searchParams.get('type'));
    const name = req.url.searchParams.get('name') || '';
    const dataset = await createDeserializedObject(
      () =>
        req.body.json<{
          schemas: EntitySchemaOptions<unknown>[];
          events: ClientEvent<unknown>[];
        }>(),
      (source) => {
        const events = [];
        for (const event of source.events) {
          const action = readAction(event.action);
          if (action !== 'save' && action !== 'remove' && action !== 'write') {
            return null;
          }
          events.push({
            ...event,
            action,
          });
        }
        return {
          ...source,
          events,
        };
      },
      (target) => {
        for (const schema of target.schemas) {
          if (!schema) return false;
          if (typeof schema !== 'object') return false;
        }
        for (const event of target.events) {
          if (typeof event.target !== 'string') return false;
          if (!Array.isArray(event.values)) return false;
        }
        return true;
      },
    );
    if (!type || !name || !dataset) {
      return {
        code: 400,
        body: {
          success: false,
        },
      };
    }
    const scheduler = await updateContext(
      type,
      name,
      dataset.schemas,
      dataset.events,
    );
    if (!scheduler) {
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
  },
};

const putContextByRpc: Plugin<ContextDefinition> = {
  definition: ContextDefinition,
  handlers: {
    postContext: async (req) => {
      const { secret } = req;
      if ((secret || '') !== readSecret()) {
        return {
          success: false,
        };
      }
      const type = readType(req.type);
      const name = req.name;
      const dataset = await createDeserializedObject(
        () => req.dataset,
        (source, parser) => {
          const events = [];
          for (const event of source.events) {
            const action = readAction(event.action);
            if (
              action !== 'save' &&
              action !== 'remove' &&
              action !== 'write'
            ) {
              return null;
            }
            events.push({
              ...event,
              action,
              values: event.values.map(parser),
            });
          }
          return {
            ...source,
            schemas: source.schemas.map((schema) =>
              parser<EntitySchemaOptions<unknown>>(schema),
            ),
            events,
          };
        },
        (target) => {
          for (const schema of target.schemas) {
            if (!schema) return false;
            if (typeof schema !== 'object') return false;
          }
          for (const event of target.events) {
            if (typeof event.target !== 'string') return false;
            if (!Array.isArray(event.values)) return false;
          }
          return true;
        },
      );
      if (!type || !name || !dataset) {
        return {
          success: false,
        };
      }
      const scheduler = await updateContext(
        type,
        name,
        dataset.schemas,
        dataset.events,
      );
      if (!scheduler) {
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

export { putContextByHttp, putContextByRpc };
