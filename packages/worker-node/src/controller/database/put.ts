import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { DatabaseAction, DatabaseDefinition } from './proto';
import { adapterMapper, type AdapterTypeAlias } from '../../domain';
import { updateDatabase } from '../../service';

const actionMapper: Record<
  DatabaseAction.REMOVE | DatabaseAction.SAVE,
  'remove' | 'save'
> = {
  [DatabaseAction.REMOVE]: 'remove',
  [DatabaseAction.SAVE]: 'save',
};

const http: Route = {
  method: 'PUT',
  pathname: '/database',
  handler: async (req) => {
    const { url, body } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const adapterType = adapterMapper[Number(type) as AdapterTypeAlias];
    const action = Number(
      `/${url.pathname}/`
        .replace(/\/+/g, '/')
        .match(/^\/database\/(1|2)\//)?.[1],
    );
    const data = await body.json<{ name: string; rows: unknown[] }[]>();
    if (
      !name ||
      !adapterType ||
      (action !== DatabaseAction.REMOVE && action !== DatabaseAction.SAVE) ||
      !Array.isArray(data) ||
      data.some((item) => {
        if (!item.name) return true;
        if (typeof item.name !== 'string') return true;
        if (!Array.isArray(item.rows)) return true;
        return false;
      })
    ) {
      return {
        code: 400,
        body: {
          success: false,
        },
      };
    }
    const database = await updateDatabase(
      adapterType,
      name,
      actionMapper[action],
      data,
    );
    if (!database) {
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

const rpc: Plugin<DatabaseDefinition> = {
  definition: DatabaseDefinition,
  handlers: {
    putDatabase: async (req) => {
      const { action, data, name, type } = req;
      const adapterType = adapterMapper[type as AdapterTypeAlias];
      if (
        !name ||
        !adapterType ||
        (action !== DatabaseAction.REMOVE && action !== DatabaseAction.SAVE) ||
        data.some((item) => {
          if (!item.name) return true;
          if (typeof item.name !== 'string') return true;
          if (!Array.isArray(item.rows)) return true;
          return false;
        })
      ) {
        return {
          success: false,
        };
      }
      const database = await updateDatabase(
        adapterType,
        name,
        actionMapper[action],
        data.map(({ name, rows }) => ({
          name,
          rows: rows.map((row) => JSON.parse(row)),
        })),
      );
      if (!database) {
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

export { http, rpc };
