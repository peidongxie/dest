import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import {
  ExpectationDefinition,
  type AssertionPart,
  type ClientSnapshot,
} from '../../domain';
import { createExpectation, readSecret } from '../../service';

const postExpectationByHttp: Route = {
  method: 'POST',
  pathname: '/expectation',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret');
    if ((secret || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
          uuid: '',
        },
      };
    }
    const { body } = req;
    const benchmark = await body.json<{
      snapshots: ClientSnapshot<unknown>[];
      parts: { count: number; rows: unknown[] }[];
    }>();
    const clientSnapshots =
      benchmark?.snapshots.map<ClientSnapshot<unknown> | null>((snapshot) => {
        if (typeof snapshot.table !== 'string') return null;
        if (!Array.isArray(snapshot.rows)) return null;
        return snapshot;
      });
    const assertionParts = benchmark?.parts.map<AssertionPart<unknown> | null>(
      (part) => {
        if (typeof part.count !== 'number') return null;
        if (!Array.isArray(part.rows)) return null;
        return part;
      },
    );
    if (
      !benchmark ||
      !Array.isArray(clientSnapshots) ||
      !clientSnapshots?.every((snapshot) => snapshot !== null) ||
      !Array.isArray(assertionParts) ||
      !assertionParts?.every((part) => part !== null)
    ) {
      return {
        code: 400,
        body: {
          success: false,
          uuid: '',
        },
      };
    }
    const expectation = await createExpectation(
      clientSnapshots as ClientSnapshot<unknown>[],
      assertionParts as AssertionPart<unknown>[],
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
      const { secret } = req;
      if ((secret || '') !== readSecret()) {
        return {
          success: false,
          uuid: '',
        };
      }
      const { benchmark } = req;
      const assertionParts =
        benchmark?.parts.map<AssertionPart<unknown> | null>((part) => {
          if (typeof part.count !== 'number') return null;
          if (!Array.isArray(part.rows)) return null;
          return {
            ...part,
            rows: part.rows.map((row) => JSON.parse(row)),
          };
        });
      const clientSnapshots =
        benchmark?.snapshots.map<ClientSnapshot<unknown> | null>((snapshot) => {
          if (typeof snapshot.table !== 'string') return null;
          if (!Array.isArray(snapshot.rows)) return null;
          return {
            ...snapshot,
            rows: snapshot.rows.map((row) => JSON.parse(row)),
          };
        });
      if (
        !benchmark ||
        !Array.isArray(clientSnapshots) ||
        !clientSnapshots?.every((snapshot) => snapshot !== null) ||
        !Array.isArray(assertionParts) ||
        !assertionParts?.every((part) => part !== null)
      ) {
        return {
          success: false,
          uuid: '',
        };
      }
      const expectation = await createExpectation(
        clientSnapshots as ClientSnapshot<unknown>[],
        assertionParts as AssertionPart<unknown>[],
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
