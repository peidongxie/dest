import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ActualityDefinition } from '../../domain';
import {
  createSerializedObject,
  readActuality,
  readSecret,
} from '../../service';

const getActualityByHttp: Route = {
  method: 'GET',
  pathname: '/actuality',
  handler: async (req) => {
    if ((req.url.searchParams.get('secret') || '') !== readSecret()) {
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
    const uuid = req.url.searchParams.get('uuid') || '';
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
      if (req.secret !== readSecret()) {
        return {
          success: false,
          uuid: '',
          snapshots: [],
          rows: [],
          error: '',
          time: 0,
        };
      }
      const uuid = req.uuid;
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
      const actuality = await createSerializedObject(
        () => readActuality(uuid),
        (source, stringifier) => ({
          ...source,
          snapshots: source.snapshots.map((snapshot) => ({
            ...snapshot,
            rows: snapshot.rows.map((row) => stringifier(row)),
          })),
          rows: source.rows.map((row) => stringifier(row)),
        }),
      );
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
      };
    },
  },
};

export { getActualityByHttp, getActualityByRpc };
