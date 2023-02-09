import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ActualityDefinition } from '../../domain';
import {
  createActuality,
  readAction,
  readSecret,
  readType,
} from '../../service';

const postActualityByHttp: Route = {
  method: 'POST',
  pathname: '/actuality',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret');
    if ((secret || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
          uuid: '',
        },
      };
    }
    const { body, url } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const condition = await body.json<{
      action: number;
      query: string;
      values: unknown[];
      tables: string[];
    }>();
    const clientType = readType(type);
    const clientAction = readAction(condition?.action);
    if (
      !clientType ||
      !name ||
      !condition ||
      (clientAction !== 'read' && clientAction !== 'write') ||
      !condition.query ||
      !Array.isArray(condition.values) ||
      !Array.isArray(condition.tables)
    ) {
      return {
        code: 400,
        body: {
          success: false,
          uuid: '',
        },
      };
    }
    const actuality = await createActuality(clientType, name, {
      ...condition,
      action: clientAction,
    });
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
      const { secret } = req;
      if ((secret || '') !== readSecret()) {
        return {
          success: false,
          uuid: '',
        };
      }
      const { condition, name, type } = req;
      const clientType = readType(type);
      const clientAction = readAction(condition?.action);
      if (
        !clientType ||
        !name ||
        !condition ||
        (clientAction !== 'read' && clientAction !== 'write') ||
        !condition.query ||
        !Array.isArray(condition.values) ||
        !Array.isArray(condition.tables)
      ) {
        return {
          success: false,
          uuid: '',
        };
      }
      const actuality = await createActuality(clientType, name, {
        ...condition,
        action: clientAction,
        values: condition.values.map((value) => JSON.parse(value)),
      });
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
