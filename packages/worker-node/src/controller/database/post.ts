import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { type EntitySchemaOptions } from 'typeorm';
import { DatabaseDefinition } from '../../domain';
import {
  createDatabase,
  createDeserializedObject,
  readSecret,
  readType,
} from '../../service';

const postDatabaseByHttp: Route = {
  method: 'POST',
  pathname: '/database',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret') || '';
    if (secret !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
        },
      };
    }
    const { body, url } = req;
    const name = url.searchParams.get('name') || '';
    const type = url.searchParams.get('type') || '';
    const schemas = await body.json<EntitySchemaOptions<unknown>[]>();
    const entitySchemas = createDeserializedObject(
      schemas,
      (source) => source,
      (target) => {
        for (const schema of target) {
          if (!schema) return false;
          if (typeof schema !== 'object') return false;
        }
        return true;
      },
    );
    const adapterType = readType(type);
    if (!adapterType || !name || !entitySchemas) {
      return {
        code: 400,
        body: {
          success: false,
        },
      };
    }
    const scheduler = await createDatabase(adapterType, name, entitySchemas);
    if (!scheduler) {
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
      if (secret !== readSecret()) {
        return {
          success: false,
        };
      }
      const { name, schemas, type } = req;
      const adapterType = readType(type);
      const entitySchemas = createDeserializedObject(
        schemas,
        (source, parser) =>
          source.map((schema) => parser<EntitySchemaOptions<unknown>>(schema)),
        (target) => {
          for (const schema of target) {
            if (!schema) return false;
            if (typeof schema !== 'object') return false;
          }
          return true;
        },
      );
      if (!adapterType || !name || !entitySchemas) {
        return {
          success: false,
        };
      }
      const scheduler = await createDatabase(adapterType, name, entitySchemas);
      if (!scheduler) {
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
