import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { type EntitySchemaOptions } from 'typeorm';
import { ContextDefinition, type ClientEvent } from '../../domain';
import { createContext, readAction, readSecret, readType } from '../../service';

const postContextByHttp: Route = {
  method: 'POST',
  pathname: '/context',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret');
    if ((secret || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
        },
      };
    }
    const { body, url } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const dataset = await body.json<{
      schemas: EntitySchemaOptions<unknown>[];
      events: ClientEvent<unknown>[];
    }>();
    const clientType = readType(type);
    const clientEvents = dataset?.events?.map<ClientEvent<unknown> | null>(
      (event) => {
        const clientAction = readAction(event?.action);
        if (
          !clientAction ||
          clientAction === 'read' ||
          clientAction === 'root' ||
          clientAction === 'introspect' ||
          !event.target ||
          !Array.isArray(event.values)
        )
          return null;
        return {
          ...event,
          action: clientAction,
        };
      },
    );
    if (
      !clientType ||
      !name ||
      !dataset ||
      !Array.isArray(dataset.schemas) ||
      !Array.isArray(dataset.events) ||
      !clientEvents?.every((event) => event !== null)
    ) {
      return {
        code: 400,
        body: {
          success: false,
        },
      };
    }
    const scheduler = await createContext(
      clientType,
      name,
      dataset.schemas,
      clientEvents as ClientEvent<unknown>[],
    );
    if (!scheduler) {
      return {
        code: 409,
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
      const { secret } = req;
      if ((secret || '') !== readSecret()) {
        return {
          success: false,
        };
      }
      const { dataset, name, type } = req;
      const clientType = readType(type);
      const clientEvents = dataset?.events?.map<ClientEvent<unknown> | null>(
        (event) => {
          const clientAction = readAction(event?.action);
          if (
            !clientAction ||
            clientAction === 'read' ||
            clientAction === 'root' ||
            clientAction === 'introspect' ||
            !event.target ||
            !Array.isArray(event.values)
          )
            return null;
          return {
            ...event,
            action: clientAction,
            values: event.values.map((value) => JSON.parse(value)),
          };
        },
      );
      if (
        !clientType ||
        !name ||
        !dataset ||
        !Array.isArray(dataset.schemas) ||
        !Array.isArray(dataset.events) ||
        !clientEvents?.every((event) => event !== null)
      ) {
        return {
          success: false,
        };
      }
      const scheduler = await createContext(
        clientType,
        name,
        dataset.schemas.map((schema) => JSON.parse(schema)),
        clientEvents as ClientEvent<unknown>[],
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
