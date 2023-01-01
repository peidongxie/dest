import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { EventAction, QueryDefinition } from './proto';
import { adapterMapper, type AdapterTypeAlias } from '../../domain';
import { createQuery } from '../../service';

const eventMapper: Record<
  EventAction,
  'save' | 'remove' | 'read' | 'write' | 'root' | null
> = {
  [EventAction.DEFAULT_ACTION]: null,
  [EventAction.SAVE]: 'save',
  [EventAction.REMOVE]: 'remove',
  [EventAction.READ]: 'read',
  [EventAction.WRITE]: 'write',
  [EventAction.ROOT]: 'root',
  [EventAction.UNRECOGNIZED]: null,
};

const postQueryByHttp: Route = {
  method: 'POST',
  pathname: '/query',
  handler: async (req) => {
    const { url, body } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const baseType = adapterMapper[Number(type) as AdapterTypeAlias] || null;
    const event = await body.json<{
      action: EventAction;
      target: string;
      values: unknown[];
    }>();
    const eventAction =
      eventMapper[Number(event?.action) as EventAction] || null;
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
    const result = await createQuery(
      baseType,
      name || '',
      eventAction,
      event.target,
      event.values,
    );
    if (!result) {
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
      const baseType = adapterMapper[type as AdapterTypeAlias] || null;
      const eventAction = eventMapper[event?.action as EventAction] || null;
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
      const result = await createQuery(
        baseType,
        name || '',
        eventAction,
        event.target,
        event.values.map((value) => JSON.parse(value)),
      );
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
