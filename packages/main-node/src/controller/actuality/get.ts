import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ActualityDefinition } from '../../domain';
import { readActuality, readSecret } from '../../service';

const getActualityByHttp: Route = {
  method: 'GET',
  pathname: '/actuality',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret');
    if ((secret || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
          uuid: '',
          snapshots: [],
          rows: [],
          error: '',
          time: 0,
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
          uuid: '',
          snapshots: [],
          rows: [],
          error: '',
          time: 0,
        },
      };
    }
    const actuality = readActuality(uuid);
    if (!actuality) {
      return {
        code: 404,
        body: {
          success: false,
          uuid: '',
          snapshots: [],
          rows: [],
          error: '',
          time: 0,
        },
      };
    }
    return {
      code: 200,
      body: {
        success: true,
        ...actuality,
      },
    };
  },
};

const getActualityByRpc: Plugin<ActualityDefinition> = {
  definition: ActualityDefinition,
  handlers: {
    getActuality: async (req) => {
      const { secret } = req;
      if ((secret || '') !== readSecret()) {
        return {
          success: false,
          uuid: '',
          snapshots: [],
          rows: [],
          error: '',
          time: 0,
        };
      }
      const { uuid } = req;
      if (!uuid) {
        return {
          success: false,
          uuid: '',
          snapshots: [],
          rows: [],
          error: '',
          time: 0,
        };
      }
      const actuality = readActuality(uuid);
      if (!actuality) {
        return {
          success: false,
          uuid: '',
          snapshots: [],
          rows: [],
          error: '',
          time: 0,
        };
      }
      return {
        success: true,
        ...actuality,
        snapshots: actuality.snapshots.map((snapshot) => ({
          ...snapshot,
          rows: snapshot.rows.map((row) => JSON.stringify(row)),
        })),
        rows: actuality.rows.map((row) => JSON.stringify(row)),
      };
    },
  },
};

export { getActualityByHttp, getActualityByRpc };
