import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { type EntitySchemaOptions } from 'typeorm';
import { DatabaseDefinition } from '../../domain';
import { createDatabase, readSecret, readType } from '../../service';

const postDatabaseByHttp: Route = {
  method: 'POST',
  pathname: '/database',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret');
    if ((secret || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
        },
      };
    }
    const { body, url } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const schemas = await body.json<EntitySchemaOptions<unknown>[]>();
    const adapterType = readType(type);
    if (!adapterType || !name || !Array.isArray(schemas)) {
      return {
        code: 400,
        body: {
          success: false,
        },
      };
    }
    const database = await createDatabase(adapterType, name, schemas);
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
      const { secret } = req;
      if ((secret || '') !== readSecret()) {
        return {
          success: false,
        };
      }
      const { name, schemas, type } = req;
      const adapterType = readType(type);
      if (!adapterType || !name || !Array.isArray(schemas)) {
        return {
          success: false,
        };
      }
      const database = await createDatabase(
        adapterType,
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
