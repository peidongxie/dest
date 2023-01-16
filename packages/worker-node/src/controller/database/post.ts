import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { type EntitySchemaOptions } from 'typeorm';
import { DatabaseDefinition } from './proto';
import { type AdapterType } from '../../domain';
import { createDatabase, readMemo } from '../../service';

const postDatabaseByHttp: Route = {
  method: 'POST',
  pathname: '/database',
  handler: async (req) => {
    const { url, body } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const baseType = readMemo<AdapterType>(['type', type || '']);
    const schemas = await body.json<EntitySchemaOptions<unknown>[]>();
    if (!name || !baseType || !Array.isArray(schemas)) {
      return {
        code: 400,
        body: {
          success: false,
        },
      };
    }
    const database = await createDatabase(baseType, name, schemas);
    if (!database) {
      return {
        code: 409,
        body: {
          success: false,
        },
      };
    }
    return {
      code: 201,
      body: {
        success: true,
      },
    };
  },
};

const postDatabaseByRpc: Plugin<DatabaseDefinition> = {
  definition: DatabaseDefinition,
  handlers: {
    postDatabase: async (req) => {
      const { name, schemas, type } = req;
      const baseType = readMemo<AdapterType>(['type', type || '']);
      if (!name || !baseType || !Array.isArray(schemas)) {
        return {
          success: false,
        };
      }
      const database = await createDatabase(
        baseType,
        name,
        schemas.map((schema) => JSON.parse(schema)),
      );
      if (!database) {
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

export { postDatabaseByHttp, postDatabaseByRpc };
