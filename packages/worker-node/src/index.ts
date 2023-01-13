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

// createMemo<AdapterType>(['type', BaseType.MARIADB.toString()], 'mariadb');
// createMemo<AdapterType>(['type', BaseType.MYSQL8.toString()], 'mysql:8');
createMemo<AdapterType>(['type', BaseType.SQLITE.toString()], 'sqlite');
createMemo<DatabaseAction>(['action', EventAction.SAVE.toString()], 'save');
createMemo<DatabaseAction>(['action', EventAction.REMOVE.toString()], 'remove');
createMemo<DatabaseAction>(['action', EventAction.READ.toString()], 'read');
createMemo<DatabaseAction>(['action', EventAction.WRITE.toString()], 'write');
createMemo<DatabaseAction>(['action', EventAction.ROOT.toString()], 'root');
// await createDatabase('mariadb', '', []);
await createDatabase('sqlite', '', []);
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
