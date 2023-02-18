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
        for (const snapshot of target.snapshots) {
          if (typeof snapshot.table !== 'string') return false;
          if (!Array.isArray(snapshot.rows)) return false;
        }
        for (const part of target.parts) {
          if (typeof part.count !== 'number') return false;
          if (!Array.isArray(part.rows)) return false;
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
    const expectation = await createExpectation(
      benchmark.snapshots,
      benchmark.parts,
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
          for (const snapshot of target.snapshots) {
            if (typeof snapshot.table !== 'string') return false;
            if (!Array.isArray(snapshot.rows)) return false;
          }
          for (const part of target.parts) {
            if (typeof part.count !== 'number') return false;
            if (!Array.isArray(part.rows)) return false;
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
      const expectation = await createExpectation(
        benchmark.snapshots,
        benchmark.parts,
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
