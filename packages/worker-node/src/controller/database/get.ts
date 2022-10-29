import { type PluginHandler } from '@dest-toolkit/http-server';
import {
  adapterMapper,
  type AdapterType,
  type AdapterTypeAlias,
} from '../../domain';
import { readDatabase } from '../../service';

const handler: PluginHandler = async (req) => {
  const { url } = req;
  const type =
    adapterMapper[
      url.searchParams.get('type') as AdapterType | AdapterTypeAlias
    ];
  const name = url.searchParams.get('name');
  if (!type || !name) {
    return {
      code: 400,
      body: {
        success: false,
        data: [],
      },
    };
  }
  const database = readDatabase(type, name);
  if (!database) {
    return {
      code: 404,
      body: {
        success: false,
        data: [],
      },
    };
  }
  return {
    code: 200,
    body: {
      success: true,
      data: await database.snapshot(),
    },
  };
};

export default handler;
