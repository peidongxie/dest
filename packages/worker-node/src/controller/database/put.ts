import { type CommonHandler } from '@dest-toolkit/http-server';
import {
  adapterMapper,
  type AdapterType,
  type AdapterTypeAlias,
} from '../../domain';
import { updateDatabase } from '../../service';

const handler: CommonHandler = async (req) => {
  const { url, body } = req;
  const type =
    adapterMapper[
      url.searchParams.get('type') as AdapterType | AdapterTypeAlias
    ];
  const name = url.searchParams.get('name');
  const data = await body.json<
    { type: 'remove' | 'save'; name: string; rows: unknown[] }[]
  >();
  if (
    !type ||
    !name ||
    !Array.isArray(data) ||
    data.some((item) => {
      if (item.type !== 'remove' && item.type !== 'save') return true;
      if (!item.name) return true;
      if (typeof item.name !== 'string') return true;
      if (!Array.isArray(item.rows)) return true;
      return false;
    })
  ) {
    return {
      code: 400,
      body: {
        success: false,
      },
    };
  }
  const database = await updateDatabase(type, name, data);
  if (!database) {
    return {
      code: 404,
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
