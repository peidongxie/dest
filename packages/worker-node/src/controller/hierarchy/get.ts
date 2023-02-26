import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { HierarchyDefinition } from '../../domain';
import {
  createSerializedObject,
  readEnum,
  readHierarchyDatabase,
  readHierarchyEnvironment,
  readHierarchyRow,
  readHierarchyTable,
  readLevel,
  readSecret,
  readType,
} from '../../service';

const getHierarchyByHttp: Route = {
  method: 'GET',
  pathname: '/hierarchy',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret') || '';
    if (secret !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
          environments: [],
        },
      };
    }
    const type = readType(req.url.searchParams.get('type'));
    const name = req.url.searchParams.get('name') || '';
    const table = req.url.searchParams.get('table') || '';
    const level = readLevel(req.url.searchParams.get('level'));
    if (
      type === null ||
      level === null ||
      (!type && !name && table) ||
      (!type && name && !table) ||
      (!type && name && table) ||
      (type && !name && table)
    ) {
      return {
        code: 400,
        body: {
          success: false,
          environments: [],
        },
      };
    }
    const environments = await createSerializedObject(
      () =>
        level === 'environment'
          ? readHierarchyEnvironment()
          : level === 'database'
          ? readHierarchyDatabase(type)
          : level === 'table'
          ? readHierarchyTable(type, name)
          : level === 'row'
          ? readHierarchyRow(type, name, table)
          : [],
      (source) =>
        source.map((environment) => ({
          ...environment,
          type: readEnum(environment.type),
        })),
    );
    if (!environments) {
      return {
        code: 404,
        body: {
          success: false,
          environments: [],
        },
      };
    }
    return {
      code: 200,
      body: {
        success: true,
        environments,
      },
    };
  },
};

const getHierarchyByRpc: Plugin<HierarchyDefinition> = {
  definition: HierarchyDefinition,
  handlers: {
    getHierarchy: async (req) => {
      if (req.secret !== readSecret()) {
        return {
          success: false,
          environments: [],
        };
      }
      const type = readType(req.type);
      const name = req.name;
      const table = req.table;
      const level = readLevel(req.level);
      if (
        type === null ||
        level === null ||
        (!type && !name && table) ||
        (!type && name && !table) ||
        (!type && name && table) ||
        (type && !name && table)
      ) {
        return {
          success: false,
          environments: [],
        };
      }
      const environments = await createSerializedObject(
        async () =>
          level === 'environment'
            ? readHierarchyEnvironment()
            : level === 'database'
            ? readHierarchyDatabase(type)
            : level === 'table'
            ? readHierarchyTable(type, name)
            : level === 'row'
            ? readHierarchyRow(type, name, table)
            : [],
        (source, stringifier) =>
          source.map((environment) => ({
            type: readEnum(environment.type),
            databases: environment.databases.map((database) => ({
              ...database,
              snapshots: database.snapshots.map((snapshot) => ({
                ...snapshot,
                rows: snapshot.rows.map(stringifier),
              })),
            })),
          })),
      );
      if (!environments) {
        return {
          success: false,
          environments: [],
        };
      }
      return {
        success: true,
        environments,
      };
    },
  },
};

export { getHierarchyByHttp, getHierarchyByRpc };
