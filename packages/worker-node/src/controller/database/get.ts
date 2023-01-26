import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { DatabaseDefinition, type AdapterType } from '../../domain';
import { createInspection, createInspections, readMemo } from '../../service';

const getDatabaseByHttp: Route = {
  method: 'GET',
  pathname: '/database',
  handler: async (req) => {
    const { url } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const baseType = readMemo<AdapterType>(['type', Number(type)]);
    if (!baseType) {
      return {
        code: 400,
        body: {
          success: false,
          hierarchies: [],
        },
      };
    }
    const promise = name
      ? createInspection(baseType, name)
      : createInspections(baseType);
    if (!promise) {
      return {
        code: 404,
        body: {
          success: false,
          hierarchies: [],
        },
      };
    }
    const hierarchy = await promise;
    if (!hierarchy) {
      return {
        body: {
          success: false,
          hierarchies: [],
        },
      };
    }
    const hierarchies = Array.isArray(hierarchy) ? hierarchy : [hierarchy];
    return {
      code: 200,
      body: {
        success: true,
        hierarchies,
      },
    };
  },
};

const getDatabaseByRpc: Plugin<DatabaseDefinition> = {
  definition: DatabaseDefinition,
  handlers: {
    getDatabase: async (req) => {
      const { name, type } = req;
      const baseType = readMemo<AdapterType>(['type', type]);
      if (!baseType) {
        return {
          success: false,
          hierarchies: [],
        };
      }
      const promise = name
        ? createInspection(baseType, name)
        : createInspections(baseType);
      if (!promise) {
        return {
          success: false,
          hierarchies: [],
        };
      }
      const hierarchy = await promise;
      if (!hierarchy) {
        return {
          success: false,
          hierarchies: [],
        };
      }
      const hierarchies = Array.isArray(hierarchy) ? hierarchy : [hierarchy];
      return {
        success: true,
        hierarchies: hierarchies.map((hierarchy) => ({
          ...hierarchy,
          snapshots: hierarchy.snapshots.map((snapshot) => ({
            ...snapshot,
            rows: snapshot.rows.map((row) => JSON.stringify(row)),
          })),
        })),
      };
    },
  },
};

export { getDatabaseByHttp, getDatabaseByRpc };
