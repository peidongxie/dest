import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import {
  HierarchyDefinition,
  type AdapterType,
  type HierarchyLevel,
  type TypeEnum,
} from '../../domain';
import {
  readHierarchyDatabase,
  readHierarchyEnvironment,
  readHierarchyRow,
  readHierarchyTable,
  readMemo,
} from '../../service';

const getHierarchyByHttp: Route = {
  method: 'GET',
  pathname: '/hierarchy',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret');
    if ((secret || '') !== (readMemo<string>(['secret']) || '')) {
      return {
        code: 401,
        body: {
          success: false,
          environments: [],
        },
      };
    }
    const { url } = req;
    const level = url.searchParams.get('level');
    const name = url.searchParams.get('name');
    const table = url.searchParams.get('table');
    const type = url.searchParams.get('type');
    const adapterType = Number(type)
      ? readMemo<AdapterType>(['type', Number(type)])
      : '';
    const hierarchyLevel = Number(level)
      ? readMemo<HierarchyLevel>(['level', Number(level)])
      : '';
    if (
      adapterType === null ||
      hierarchyLevel === null ||
      (!adapterType && !name && table) ||
      (!adapterType && name && !table) ||
      (!adapterType && name && table) ||
      (adapterType && !name && table)
    ) {
      return {
        code: 400,
        body: {
          success: false,
          environments: [],
        },
      };
    }
    const environments =
      hierarchyLevel === 'environment'
        ? await readHierarchyEnvironment()
        : hierarchyLevel === 'database'
        ? await readHierarchyDatabase(adapterType || undefined)
        : hierarchyLevel === 'table'
        ? await readHierarchyTable(adapterType || undefined, name || undefined)
        : hierarchyLevel === 'row'
        ? await readHierarchyRow(
            adapterType || undefined,
            name || undefined,
            table || undefined,
          )
        : [];
    return {
      code: 200,
      body: {
        success: true,
        environments: environments.map((environment) => ({
          ...environment,
          type: readMemo<TypeEnum>(['enum', environment.type]) as TypeEnum,
        })),
      },
    };
  },
};

const getHierarchyByRpc: Plugin<HierarchyDefinition> = {
  definition: HierarchyDefinition,
  handlers: {
    getHierarchy: async (req) => {
      const { secret } = req;
      if ((secret || '') !== (readMemo<string>(['secret']) || '')) {
        return {
          success: false,
          environments: [],
        };
      }
      const { level, name, table, type } = req;
      const adapterType = type ? readMemo<AdapterType>(['type', type]) : '';
      const hierarchyLevel = level
        ? readMemo<HierarchyLevel>(['level', level])
        : '';
      if (
        adapterType === null ||
        hierarchyLevel === null ||
        (!adapterType && !name && table) ||
        (!adapterType && name && !table) ||
        (!adapterType && name && table) ||
        (adapterType && !name && table)
      ) {
        return {
          success: false,
          environments: [],
        };
      }
      const environments =
        hierarchyLevel === 'environment'
          ? await readHierarchyEnvironment()
          : hierarchyLevel === 'database'
          ? await readHierarchyDatabase(adapterType || undefined)
          : hierarchyLevel === 'table'
          ? await readHierarchyTable(
              adapterType || undefined,
              name || undefined,
            )
          : hierarchyLevel === 'row'
          ? await readHierarchyRow(
              adapterType || undefined,
              name || undefined,
              table || undefined,
            )
          : [];
      return {
        success: true,
        environments: environments.map((environment) => ({
          type: readMemo<TypeEnum>(['enum', environment.type]) as TypeEnum,
          databases: environment.databases.map((database) => ({
            ...database,
            snapshots: database.snapshots.map((snapshot) => ({
              ...snapshot,
              rows: snapshot.rows.map((row) => JSON.stringify(row)),
            })),
          })),
        })),
      };
    },
  },
};

export { getHierarchyByHttp, getHierarchyByRpc };
