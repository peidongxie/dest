import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import {
  ExpectationDefinition,
  type AssertionPart,
  type ClientSnapshot,
} from '../../domain';
import {
  createDeserializedObject,
  createExpectation,
  createSerializedObject,
  readSecret,
} from '../../service';

const postExpectationByHttp: Route = {
  method: 'POST',
  pathname: '/expectation',
  handler: async (req) => {
    if ((req.url.searchParams.get('secret') || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
          uuid: '',
        },
      };
    }
    const benchmark = await createDeserializedObject(
      () =>
        req.body.json<{
          snapshots: ClientSnapshot<unknown>[];
          parts: AssertionPart<unknown>[];
        }>(),
      (source) => source,
      (target) => {
        if (!Array.isArray(target.snapshots)) return false;
        if (
          target.snapshots.some((snapshot) => {
            if (typeof snapshot.table !== 'string') return true;
            if (snapshot.table === '') return true;
            if (!Array.isArray(snapshot.rows)) return true;
            return false;
          })
        ) {
          return false;
        }
        if (!Array.isArray(target.parts)) return false;
        if (
          target.parts.map((part) => {
            if (!Number.isInteger(part.count)) return true;
            if (part.count < 0) return true;
            if (!Array.isArray(part.rows)) return true;
            return false;
          })
        ) {
          return false;
        }
        return true;
      },
    );
    if (!benchmark) {
      return {
        code: 400,
        body: {
          success: false,
          uuid: '',
        },
      };
    }
    const expectation = await createSerializedObject(() =>
      createExpectation(benchmark.snapshots, benchmark.parts),
    );
    if (!expectation) {
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
        uuid: expectation.uuid,
      },
    };
  },
};

const postExpectationByRpc: Plugin<ExpectationDefinition> = {
  definition: ExpectationDefinition,
  handlers: {
    postExpectation: async (req) => {
      if (req.secret !== readSecret()) {
        return {
          success: false,
          uuid: '',
        };
      }
      const benchmark = await createDeserializedObject(
        () => req.benchmark,
        (source, parser) => ({
          ...source,
          snapshots: source.snapshots.map((snapshot) => ({
            ...snapshot,
            rows: snapshot.rows.map(parser),
          })),
          parts: source.parts.map((part) => ({
            ...part,
            rows: part.rows.map(parser),
          })),
        }),
        (target) => {
          if (
            target.snapshots.some((snapshot) => {
              if (snapshot.table === '') return true;
              return false;
            })
          ) {
            return false;
          }
          return true;
        },
      );

      if (!benchmark) {
        return {
          success: false,
          uuid: '',
        };
      }
      const expectation = await createSerializedObject(() =>
        createExpectation(benchmark.snapshots, benchmark.parts),
      );
      if (!expectation) {
        return {
          success: false,
          uuid: '',
        };
      }
      return {
        success: true,
        uuid: expectation.uuid,
      };
    },
  },
};

export { postExpectationByHttp, postExpectationByRpc };
