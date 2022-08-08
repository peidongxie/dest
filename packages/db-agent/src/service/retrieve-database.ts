import { type Handler } from '@dest-toolkit/http-server';
import Database, {
  type DatabaseType,
  type DatabaseTypeAlias,
} from '../domain/database';

const handler: Handler = async (req) => {
  const { url } = req;
  const type = url.searchParams.get('type') as DatabaseType | DatabaseTypeAlias;
  const name = url.searchParams.get('name') as string;
  if (!type || !name) {
    return {
      code: 400,
      body: {
        success: false,
      },
    };
  }
  const database = Database.find(type, name);
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
      schemas: database.schemas,
    },
  };
};

export default handler;
