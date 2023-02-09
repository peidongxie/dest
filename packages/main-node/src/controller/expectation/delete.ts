import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ExpectationDefinition } from '../../domain';
import { deleteExpectation, readSecret } from '../../service';

const deleteExpectationByHttp: Route = {
  method: 'DELETE',
  pathname: '/expectation',
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
    const expectation = await deleteExpectation(uuid);
    if (!expectation) {
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

const deleteExpectationByRpc: Plugin<ExpectationDefinition> = {
  definition: ExpectationDefinition,
  handlers: {
    deleteExpectation: async (req) => {
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
      const expectation = await deleteExpectation(uuid);
      if (!expectation) {
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

export { deleteExpectationByHttp, deleteExpectationByRpc };
