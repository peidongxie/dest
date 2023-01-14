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
import { createMemo, createServer } from './service';

const config = {
  database: ['sqlite'] as AdapterType[],
  query: ['save', 'remove', 'read', 'write', 'root'] as DatabaseAction[],
  server: {
    3001: 'http',
    3002: 'rpc',
  } as Record<number, 'http' | 'rpc'>,
};

for (const type of config.database) {
  if (type === 'mariadb') {
    createMemo(['type', BaseType.MARIADB.toString()], 'mariadb');
  }
  if (type === 'mysql:8') {
    createMemo(['type', BaseType.MYSQL8.toString()], 'mysql:8');
  }
  if (type === 'sqlite') {
    createMemo(['type', BaseType.SQLITE.toString()], 'sqlite');
  }
}

for (const action of config.query) {
  if (action === 'save') {
    createMemo(['action', EventAction.SAVE.toString()], 'save');
  }
  if (action === 'remove') {
    createMemo(['action', EventAction.REMOVE.toString()], 'remove');
  }
  if (action === 'read') {
    createMemo(['action', EventAction.READ.toString()], 'read');
  }
  if (action === 'write') {
    createMemo(['action', EventAction.WRITE.toString()], 'write');
  }
  if (action === 'root') {
    createMemo(['action', EventAction.ROOT.toString()], 'root');
  }
}

for (const [port, call] of Object.entries(config.server)) {
  if (call === 'http') {
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
      Number(port),
    );
  }
  if (call === 'rpc') {
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
      Number(port),
    );
  }
}
