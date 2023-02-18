import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ActualityDefinition } from '../../domain';
import {
  createActuality,
  createDeserializedObject,
  readAction,
  readSecret,
  readType,
} from '../../service';

const postActualityByHttp: Route = {
  method: 'POST',
  pathname: '/actuality',
  handler: async (req) => {
    if ((req.url.searchParams.get('secret') || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
          uuid: '',
        },
      };
    }
    const { body, url } = req;
    const type = readType(url.searchParams.get('type'));
    const name = req.url.searchParams.get('name') || '';
    const condition = await createDeserializedObject(
      () =>
        body.json<{
          action: number;
          target: string;
          values: unknown[];
          tables: string[];
        }>(),
      (source) => {
        const action = readAction(source.action);
        if (action !== 'read' && action !== 'write') return null;
        return {
          ...source,
          action,
        };
      },
      (target) => {
        if (typeof target.target !== 'string') return false;
        if (!Array.isArray(target.values)) return false;
        if (target.tables.some((table) => typeof table !== 'string')) {
          return false;
        }
        return true;
      },
    );
    if (!type || !name || !condition) {
      return {
        code: 400,
        body: {
          success: false,
          uuid: '',
        },
      };
    }
    const actuality = await createActuality(type, name, condition);
    if (!actuality) {
      return {
        code: 404,
        body: {
          success: false,
          uuid: '',
        },
      };
    }
    return {
      code: 200,
      body: {
        success: true,
        uuid: actuality.uuid,
      },
    };
  },
};

const postActualityByRpc: Plugin<ActualityDefinition> = {
  definition: ActualityDefinition,
  handlers: {
    postActuality: async (req) => {
      if (req.secret !== readSecret()) {
        return {
          success: false,
          uuid: '',
        };
      }
      const type = readType(req.type);
      const name = req.name;
      const condition = await createDeserializedObject(
        () => req.condition,
        (source) => {
          const action = readAction(source.action);
          if (action !== 'read' && action !== 'write') return null;
          const values = source.values.map((value) => JSON.parse(value));
          return {
            ...source,
            action,
            values,
          };
        },
      );
      if (!type || !name || !condition) {
        return {
          success: false,
          uuid: '',
        };
      }
      const actuality = await createActuality(type, name, condition);
      if (!actuality) {
        return {
          success: false,
          uuid: '',
        };
      }
      return {
        success: true,
        uuid: actuality.uuid,
      };
    },
  },
};

export { postActualityByHttp, postActualityByRpc };
