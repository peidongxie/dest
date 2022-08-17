import { type Handler } from '@dest-toolkit/http-server';
import {
  adapterMapper,
  type AdapterType,
  type AdapterTypeAlias,
} from '../../domain';
import { createQuery } from '../../service';

const handler: Handler = async (req) => {
  const { url, body } = req;
  const type =
    adapterMapper[
      url.searchParams.get('type') as AdapterType | AdapterTypeAlias
    ];
  const name = url.searchParams.get('name') || '';
  const privilege = `/${url.pathname}/`
    .replace(/^\/+$/g, '/')
    .match(/^\/query\/(read|root|write)\//)?.[1] as
    | 'read'
    | 'root'
    | 'write'
    | undefined;
  const query = await body.text();
  if (
    !type ||
    (!name && privilege !== 'root') ||
    (name && privilege !== 'read' && privilege !== 'write') ||
    !privilege ||
    !query
  ) {
    return {
      code: 400,
      body: {
        success: false,
      },
    };
  }
  const result = await createQuery(type, name, privilege, query);
  if (!result) {
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
      time: Number(result.time),
      result: result.result,
    },
  };
};

export default handler;
