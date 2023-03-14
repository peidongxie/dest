import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { type EntitySchemaOptions } from 'typeorm';
import { ContextDefinition, type ClientEvent } from '../../domain';
import {
  createContext,
  createDeserializedObject,
  readAction,
  readSecret,
  readType,
} from '../../service';

const postContextByHttp: Route = {
  method: 'POST',
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
        if (!Array.isArray(target.schemas)) return false;
        if (
          target.schemas.some((schema) => {
            if (typeof schema !== 'object') return true;
            if (schema === null) return true;
            return false;
          })
        ) {
          return false;
        }
        if (!Array.isArray(target.events)) return false;
        if (
          target.events.some((event) => {
            if (typeof event.target !== 'string') return true;
            if (event.target === '') return true;
            if (!Array.isArray(event.values)) return true;
            return false;
          })
        ) {
          return false;
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
    const scheduler = await createContext(
      type,
      name,
      dataset.schemas,
      dataset.events,
    );
    if (!scheduler) {
      return {
        code: 500,
        body: {
          success: false,
        },
      };
    }
    return {
      code: 201,
      body: {
        success: true,
      },
    };
  },
};

const postContextByRpc: Plugin<ContextDefinition> = {
  definition: ContextDefinition,
  handlers: {
    postContext: async (req) => {
      if (req.secret !== readSecret()) {
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
          if (
            target.schemas.some((schema) => {
              if (typeof schema !== 'object') return true;
              if (schema === null) return true;
              return false;
            })
          ) {
            return false;
          }
          if (
            target.events.some((event) => {
              if (event.target === '') return true;
              return false;
            })
          ) {
            return false;
          }
          return true;
        },
      );
      if (!type || !name || !dataset) {
        return {
          success: false,
        };
      }
      const scheduler = await createContext(
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

export { postContextByHttp, postContextByRpc };
