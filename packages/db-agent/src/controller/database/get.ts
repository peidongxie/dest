import { type Handler } from '@dest-toolkit/http-server';
import {
  adapterMapper,
  type AdapterType,
  type AdapterTypeAlias,
} from '../../domain';
import { readDatabase } from '../../service';

const handler: Handler = async (req) => {
  const { url } = req;
  const type =
    adapterMapper[
      url.searchParams.get('type') as AdapterType | AdapterTypeAlias
    ];
  const name = url.searchParams.get('name') || '';
  if (!type || !name) {
    return {
      code: 400,
      body: {
        success: false,
      },
    };
  }
  const database = readDatabase(type, name);
  if (!database) {
    return {
      code: 404,
      body: {
        success: false,
      },
    };
  }
  return {
    code: 200,
    body: {
      success: true,
    },
  };
};

export default handler;
