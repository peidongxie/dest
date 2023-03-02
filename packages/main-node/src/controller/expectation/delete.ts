import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ExpectationDefinition } from '../../domain';
import {
  createSerializedObject,
  deleteExpectation,
  readSecret,
} from '../../service';

const deleteExpectationByHttp: Route = {
  method: 'DELETE',
  pathname: '/expectation',
  handler: async (req) => {
    if ((req.url.searchParams.get('secret') || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
        },
      };
    }
    const uuid = req.url.searchParams.get('uuid');
    if (!uuid) {
      return {
        code: 400,
        body: {
          success: false,
        },
      };
    }
    const expectation = await createSerializedObject(() =>
      deleteExpectation(uuid),
    );
    if (!expectation) {
      return {
        code: 500,
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
      if (req.secret !== readSecret()) {
        return {
          success: false,
        };
      }
      const uuid = req.uuid;
      if (!uuid) {
        return {
          success: false,
        };
      }
      const expectation = await createSerializedObject(() =>
        deleteExpectation(uuid),
      );
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
