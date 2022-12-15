import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { type EntitySchemaOptions } from 'typeorm';
import { DatabaseDefinition } from './proto';
import { adapterMapper, type AdapterTypeAlias } from '../../domain';
import { createDatabase } from '../../service';

const http: Route = {
  method: 'POST',
  pathname: '/database',
  handler: async (req) => {
    const { url, body } = req;
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const adapterType = adapterMapper[Number(type) as AdapterTypeAlias];
    const schemas = await body.json<EntitySchemaOptions<unknown>[]>();
    if (!name || !adapterType || !Array.isArray(schemas)) {
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

const rpc: Plugin<DatabaseDefinition> = {
  definition: DatabaseDefinition,
  handlers: {
    postDatabase: async (req) => {
      const { name, schemas, type } = req;
      const adapterType = adapterMapper[type as AdapterTypeAlias];
      if (!name || !adapterType) {
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

export { http, rpc };
