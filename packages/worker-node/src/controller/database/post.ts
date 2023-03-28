import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { type EntitySchemaOptions } from 'typeorm';
import { DatabaseDefinition } from '../../domain';
import {
  createDatabase,
  createDeserializedObject,
  createSerializedObject,
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
    const type = readType(req.url.searchParams.get('type'));
    const name = req.url.searchParams.get('name') || '';
    const schemas = await createDeserializedObject(
      () => req.body.json<EntitySchemaOptions<unknown>[]>(),
      (source) => source.map((schema) => schema),
      (target) => {
        if (
          !target.every((schema) => {
            if (typeof schema !== 'object') return false;
            if (!schema) return false;
            return true;
          })
        ) {
          return false;
        }
        return true;
      },
    );
    if (!type || !name || !schemas) {
      return {
        code: 400,
        body: {
          success: false,
        },
      };
    }
    const scheduler = await createSerializedObject(() =>
      createDatabase(type, name, schemas),
    );
    if (!scheduler) {
      return {
        code: 500,
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
      if (req.secret !== readSecret()) {
        return {
          success: false,
        };
      }
      const type = readType(req.type);
      const name = req.name;
      const schemas = await createDeserializedObject(
        () => req.schemas,
        (source, parser) =>
          source.map((schema) => parser<EntitySchemaOptions<unknown>>(schema)),
        (target) => {
          if (
            !target.every((schema) => {
              if (typeof schema !== 'object') return false;
              if (!schema) return false;
              return true;
            })
          ) {
            return false;
          }
          return true;
        },
      );
      if (!type || !name || !schemas) {
        return {
          success: false,
        };
      }
      const scheduler = await createSerializedObject(() =>
        createDatabase(type, name, schemas),
      );
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
