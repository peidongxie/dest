import { type PluginHandler } from '@dest-toolkit/http-server';
import { type EntitySchemaOptions } from 'typeorm';
import {
  adapterMapper,
  type AdapterType,
  type AdapterTypeAlias,
} from '../../domain';
import { createDatabase } from '../../service';

const handler: PluginHandler = async (req) => {
  const { url, body } = req;
  const type =
    adapterMapper[
      url.searchParams.get('type') as AdapterType | AdapterTypeAlias
    ];
  const name = url.searchParams.get('name') || '';
  const schemas = await body.json<EntitySchemaOptions<unknown>[]>();
  if (!type || !name || !Array.isArray(schemas)) {
    return {
      code: 400,
      body: {
        success: false,
      },
    };
  }
  const database = await createDatabase(type, name, schemas);
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
};

export default handler;
