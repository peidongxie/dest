import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ExpectationDefinition } from '../../domain';
import { readExpectation, readSecret } from '../../service';

const getExpectationByHttp: Route = {
  method: 'GET',
  pathname: '/expectation',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret');
    if ((secret || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
          uuid: '',
          snapshots: [],
          parts: [],
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
          parts: [],
        },
      };
    }
    const expectation = await readExpectation(uuid);
    if (!expectation) {
      return {
        code: 404,
        body: {
          success: false,
          uuid: '',
          snapshots: [],
          parts: [],
        },
      };
    }
    return {
      code: 200,
      body: {
        success: true,
        ...expectation,
      },
    };
  },
};

const getExpectationByRpc: Plugin<ExpectationDefinition> = {
  definition: ExpectationDefinition,
  handlers: {
    getExpectation: async (req) => {
      const { secret } = req;
      if ((secret || '') !== readSecret()) {
        return {
          success: false,
          uuid: '',
          snapshots: [],
          parts: [],
        };
      }
      const { uuid } = req;
      if (!uuid) {
        return {
          success: false,
          uuid: '',
          snapshots: [],
          parts: [],
        };
      }
      const expectation = await readExpectation(uuid);
      if (!expectation) {
        return {
          success: false,
          uuid: '',
          snapshots: [],
          parts: [],
        };
      }
      return {
        success: true,
        ...expectation,
        snapshots: expectation.snapshots.map((snapshot) => ({
          ...snapshot,
          rows: snapshot.rows.map((row) => JSON.stringify(row)),
        })),
        parts: expectation.parts.map((part) => ({
          ...part,
          rows: part.rows.map((row) => JSON.stringify(row)),
        })),
      };
    },
  },
};

export { getExpectationByHttp, getExpectationByRpc };
