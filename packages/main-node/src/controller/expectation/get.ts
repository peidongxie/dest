import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { ExpectationDefinition } from '../../domain';
import {
  createSerializedObject,
  readExpectation,
  readSecret,
} from '../../service';

const getExpectationByHttp: Route = {
  method: 'GET',
  pathname: '/expectation',
  handler: async (req) => {
    if ((req.url.searchParams.get('secret') || '') !== readSecret()) {
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
    const uuid = req.url.searchParams.get('uuid') || '';
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
    const expectation = await createSerializedObject(() =>
      readExpectation(uuid),
    );
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
      if ((req.secret || '') !== readSecret()) {
        return {
          success: false,
          uuid: '',
          snapshots: [],
          parts: [],
        };
      }
      const uuid = req.uuid;
      if (!uuid) {
        return {
          success: false,
          uuid: '',
          snapshots: [],
          parts: [],
        };
      }
      const expectation = await createSerializedObject(
        () => readExpectation(uuid),
        (source, stringifier) => ({
          ...source,
          snapshots: source.snapshots.map((snapshot) => ({
            ...snapshot,
            rows: snapshot.rows.map(stringifier),
          })),
          parts: source.parts.map((part) => ({
            ...part,
            rows: part.rows.map(stringifier),
          })),
        }),
      );
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
      };
    },
  },
};

export { getExpectationByHttp, getExpectationByRpc };
