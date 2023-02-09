import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { AssertionDefinition } from '../../domain';
import { createAssertion, readSecret } from '../../service';

const postAssertionByHttp: Route = {
  method: 'POST',
  pathname: '/assertion',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret');
    if ((secret || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
          differences: [],
        },
      };
    }
    const { url } = req;
    const actuality = url.searchParams.get('actuality');
    const expectation = url.searchParams.get('expectation');
    if (!actuality || !expectation) {
      return {
        code: 400,
        body: {
          success: false,
          differences: [],
        },
      };
    }
    const differences = createAssertion(actuality, expectation);
    if (!differences) {
      return {
        code: 404,
        body: {
          success: false,
          differences: [],
        },
      };
    }
    return {
      code: 200,
      body: {
        success: true,
        differences,
      },
    };
  },
};

const postAssertionByRpc: Plugin<AssertionDefinition> = {
  definition: AssertionDefinition,
  handlers: {
    postAssertion: async (req) => {
      const { secret } = req;
      if ((secret || '') !== readSecret()) {
        return {
          success: false,
          differences: [],
        };
      }
      const { actuality, expectation } = req;
      if (!actuality || !expectation) {
        return {
          success: false,
          differences: [],
        };
      }
      const differences = createAssertion(actuality, expectation);
      if (!differences) {
        return {
          success: false,
          differences: [],
        };
      }
      return {
        success: true,
        differences: differences.map((difference) => ({
          ...difference,
          row: JSON.stringify(difference.row),
          rows: difference.rows.map((row) => JSON.stringify(row)),
        })),
      };
    },
  },
};

export { postAssertionByHttp, postAssertionByRpc };
