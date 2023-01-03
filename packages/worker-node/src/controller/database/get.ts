import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { DatabaseDefinition } from './proto';
import { type AdapterType } from '../../domain';
import { createHierarchyQuery, readDatabase, readMemo } from '../../service';

const getDatabaseByHttp: Route = {
  method: 'GET',
  pathname: '/database',
  handler: async (req) => {
    const { url } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const baseType = readMemo<AdapterType>(['type', type || '']);
    if (!baseType) {
      return {
        code: 400,
        body: {
          success: false,
          results: [],
        },
      };
    }
    const database = readDatabase(baseType, name || '');
    if (!database) {
      return {
        code: 404,
        body: {
          success: false,
          results: [],
        },
      };
    }
    const results = await createHierarchyQuery(baseType, name || '');
    if (!results) {
      return {
        success: false,
        results: [],
      };
    }
    return {
      code: 200,
      body: {
        success: true,
        results: results,
      },
    };
  },
};

const getDatabaseByRpc: Plugin<DatabaseDefinition> = {
  definition: DatabaseDefinition,
  handlers: {
    getDatabase: async (req) => {
      const { name, type } = req;
      const baseType = readMemo<AdapterType>(['type', type || '']);
      if (!baseType) {
        return {
          success: false,
          results: [],
        };
      }
      const database = readDatabase(baseType, name || '');
      if (!database) {
        return {
          success: false,
          results: [],
        };
      }
      const results = await createHierarchyQuery(baseType, name || '');
      if (!results) {
        return {
          success: false,
          results: [],
        };
      }
      return {
        success: true,
        results: results.map((result) => ({
          ...result,
          rows: result.rows.map((row) => JSON.stringify(row)),
        })),
      };
    },
  },
};

export { getDatabaseByHttp, getDatabaseByRpc };
