import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ActualityDefinition } from '../../domain';
import { deleteActuality, readSecret } from '../../service';

const deleteActualityByHttp: Route = {
  method: 'DELETE',
  pathname: '/actuality',
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
    const { url } = req;
    const uuid = url.searchParams.get('uuid');
    if (!uuid) {
      return {
        code: 400,
        body: {
          success: false,
        },
      };
    }
    const actuality = deleteActuality(uuid);
    if (!actuality) {
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

const deleteActualityByRpc: Plugin<ActualityDefinition> = {
  definition: ActualityDefinition,
  handlers: {
    deleteActuality: async (req) => {
      const { secret } = req;
      if ((secret || '') !== readSecret()) {
        return {
          success: false,
        };
      }
      const { uuid } = req;
      if (!uuid) {
        return {
          success: false,
        };
      }
      const actuality = deleteActuality(uuid);
      if (!actuality) {
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

export { deleteActualityByHttp, deleteActualityByRpc };
