import {
  deleteDatabaseByHttp,
  deleteDatabaseByRpc,
  getDatabaseByHttp,
  getDatabaseByRpc,
  postDatabaseByHttp,
  postDatabaseByRpc,
  postQueryByHttp,
  postQueryByRpc,
  putDatabaseByHttp,
  putDatabaseByRpc,
} from './controller';
import { createDatabase, createServer } from './service';

// await createDatabase('mariadb', '', []);
await createDatabase('sqlite', '', []);
await createServer(
  [
    deleteDatabaseByHttp,
    getDatabaseByHttp,
    postDatabaseByHttp,
    postQueryByHttp,
    putDatabaseByHttp,
  ],
  3001,
);
await createServer(
  [
    deleteDatabaseByRpc,
    getDatabaseByRpc,
    postDatabaseByRpc,
    postQueryByRpc,
    putDatabaseByRpc,
  ],
  3002,
);
