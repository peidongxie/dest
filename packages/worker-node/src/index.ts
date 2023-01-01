import {
  deleteDatabaseByHttp,
  deleteDatabaseByRpc,
  getDatabaseByHttp,
  getDatabaseByRpc,
  postDatabaseByHttp,
  postDatabaseByRpc,
  postQueryByHttp,
  postQueryByRpc,
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
  ],
  3001,
);
await createServer(
  [deleteDatabaseByRpc, getDatabaseByRpc, postDatabaseByRpc, postQueryByRpc],
  3002,
);
