import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { AssertionDefinition } from '../../domain';
import {
  createAssertion,
  createSerializedObject,
  readSecret,
} from '../../service';

const postAssertionByHttp: Route = {
  method: 'POST',
  pathname: '/assertion',
  handler: async (req) => {
    if ((req.url.searchParams.get('secret') || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
          differences: [],
        },
      };
    }
    const actuality = req.url.searchParams.get('actuality') || '';
    const expectation = req.url.searchParams.get('expectation') || '';
    if (!actuality || !expectation) {
      return {
        code: 400,
        body: {
          success: false,
          differences: [],
        },
      };
    }
    const differences = await createSerializedObject(() =>
      createAssertion(actuality, expectation),
    );
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
      if (req.secret !== readSecret()) {
        return {
          success: false,
          differences: [],
        };
      }
      const actuality = req.actuality;
      const expectation = req.expectation;
      if (!actuality || !expectation) {
        return {
          success: false,
          differences: [],
        };
      }
      const differences = await createSerializedObject(
        () => createAssertion(actuality, expectation),
        (source, stringifier) =>
          source.map((difference) => ({
            ...difference,
            row: stringifier(difference.row),
            rows: difference.rows.map(stringifier),
          })),
      );
      if (!differences) {
        return {
          success: false,
          differences: [],
        };
      }
      return {
        success: true,
        differences,
      };
    },
  },
};

export { postAssertionByHttp, postAssertionByRpc };
