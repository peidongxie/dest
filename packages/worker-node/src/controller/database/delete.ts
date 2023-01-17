import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { DatabaseDefinition, type AdapterType } from '../../domain';
import { deleteDatabase, deleteDatabases, readMemo } from '../../service';

const deleteDatabaseByHttp: Route = {
  method: 'DELETE',
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
        },
      };
    }
    if (name) {
      await deleteDatabases(baseType);
    } else {
      const database = await deleteDatabase(baseType, name || '');
      if (!database) {
        return {
          code: 404,
          body: {
            success: false,
          },
        };
      }
    }
    return {
      code: 200,
      body: {
        success: true,
      },
    };
  },
};

const deleteDatabaseByRpc: Plugin<DatabaseDefinition> = {
  definition: DatabaseDefinition,
  handlers: {
    deleteDatabase: async (req) => {
      const { name, type } = req;
      const baseType = readMemo<AdapterType>(['type', type]);
      if (!baseType) {
        return {
          success: false,
        };
      }
      if (name) {
        await deleteDatabases(baseType);
      } else {
        const database = await deleteDatabase(baseType, name || '');
        if (!database) {
          return {
            success: false,
          };
        }
      }
      return {
        success: true,
      };
    },
  },
};

export { deleteDatabaseByHttp, deleteDatabaseByRpc };
