import {
  BaseType,
  EventAction,
  deleteAgentByHttp,
  deleteAgentByRpc,
  deleteDatabaseByHttp,
  deleteDatabaseByRpc,
  getAgentByHttp,
  getAgentByRpc,
  getDatabaseByHttp,
  getDatabaseByRpc,
  postAgentByHttp,
  postAgentByRpc,
  postDatabaseByHttp,
  postDatabaseByRpc,
  postQueryByHttp,
  postQueryByRpc,
} from './controller';
import { AdapterType, DatabaseAction } from './domain';
import { createDatabase, createMemo, createServer } from './service';

// await createDatabase('mariadb', '', []);
await createDatabase('sqlite', '', []);
await createMemo<AdapterType>(['type', BaseType.MARIADB.toString()], 'mariadb');
await createMemo<AdapterType>(['type', BaseType.MYSQL8.toString()], 'mysql:8');
await createMemo<AdapterType>(['type', BaseType.SQLITE.toString()], 'sqlite');
await createMemo<DatabaseAction>(
  ['action', EventAction.SAVE.toString()],
  'save',
);
await createMemo<DatabaseAction>(
  ['action', EventAction.REMOVE.toString()],
  'remove',
);
await createMemo<DatabaseAction>(
  ['action', EventAction.READ.toString()],
  'read',
);
await createMemo<DatabaseAction>(
  ['action', EventAction.WRITE.toString()],
  'write',
);
await createMemo<DatabaseAction>(
  ['action', EventAction.ROOT.toString()],
  'root',
);
await createServer(
  [
    deleteAgentByHttp,
    deleteDatabaseByHttp,
    getAgentByHttp,
    getDatabaseByHttp,
    postAgentByHttp,
    postDatabaseByHttp,
    postQueryByHttp,
  ],
  3001,
);
await createServer(
  [
    deleteAgentByRpc,
    deleteDatabaseByRpc,
    getAgentByRpc,
    getDatabaseByRpc,
    postAgentByRpc,
    postDatabaseByRpc,
    postQueryByRpc,
  ],
  3002,
);
