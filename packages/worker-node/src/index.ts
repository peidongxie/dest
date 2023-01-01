import {
  BaseType,
  EventAction,
  deleteDatabaseByHttp,
  deleteDatabaseByRpc,
  getDatabaseByHttp,
  getDatabaseByRpc,
  postDatabaseByHttp,
  postDatabaseByRpc,
  postQueryByHttp,
  postQueryByRpc,
} from './controller';
import { AdapterType, DatabaseAction } from './domain';
import { createDatabase, createMemo, createServer } from './service';

// await createDatabase('mariadb', '', []);
await createDatabase('sqlite', '', []);
await createMemo<AdapterType>(['type', BaseType.MARIADB], 'mariadb');
await createMemo<AdapterType>(['type', BaseType.MYSQL8], 'mysql:8');
await createMemo<AdapterType>(['type', BaseType.SQLITE], 'sqlite');
await createMemo<DatabaseAction>(['action', EventAction.SAVE], 'save');
await createMemo<DatabaseAction>(['action', EventAction.REMOVE], 'remove');
await createMemo<DatabaseAction>(['action', EventAction.READ], 'read');
await createMemo<DatabaseAction>(['action', EventAction.WRITE], 'write');
await createMemo<DatabaseAction>(['action', EventAction.ROOT], 'root');
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
