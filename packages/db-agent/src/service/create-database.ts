import { type Handler } from '@dest-toolkit/http-server';
import { type EntitySchemaOptions } from 'typeorm';
import { type AdapterType, type AdapterTypeAlias } from '../domain/adapter';
import Database from '../domain/database';

const handler: Handler = async (req) => {
  const { url, body } = req;
  const type = url.searchParams.get('type') as AdapterType | AdapterTypeAlias;
  const name = url.searchParams.get('name') as string;
  const schemas = await body.json<EntitySchemaOptions<unknown>[]>();
  if (!type || !name || !Array.isArray(schemas)) {
    return {
      code: 400,
      body: {
        success: false,
      },
    };
  }
  const database = Database.find(type, name);
  if (database) {
    return {
      code: 409,
      body: {
        success: false,
      },
    };
  }
  const newDatabase = new Database(type, name, schemas);
  await newDatabase.create();
  return {
    code: 201,
    body: {
      success: true,
    },
  };
};

export default handler;
