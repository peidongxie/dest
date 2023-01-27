import {
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
import { AdapterType, BaseType, DatabaseAction, EventAction } from './domain';
import { createMemo, createServer } from './service';

const config = {
  database: ['sqlite'] as AdapterType[],
  query: [
    'save',
    'remove',
    'read',
    'write',
    'root',
    'introspect',
  ] as DatabaseAction[],
  server: {
    3001: 'http',
    3002: 'rpc',
  } as Record<number, 'http' | 'rpc'>,
};

for (const type of config.database) {
  if (type === 'mariadb') {
    createMemo(['type', BaseType.MARIADB], 'mariadb');
  }
  if (type === 'mysql:8') {
    createMemo(['type', BaseType.MYSQL8], 'mysql:8');
  }
  if (type === 'sqlite') {
    createMemo(['type', BaseType.SQLITE], 'sqlite');
  }
}

for (const action of config.query) {
  if (action === 'save') {
    createMemo(['action', EventAction.SAVE], 'save');
  }
  if (action === 'remove') {
    createMemo(['action', EventAction.REMOVE], 'remove');
  }
  if (action === 'read') {
    createMemo(['action', EventAction.READ], 'read');
  }
  if (action === 'write') {
    createMemo(['action', EventAction.WRITE], 'write');
  }
  if (action === 'root') {
    createMemo(['action', EventAction.ROOT], 'root');
  }
  if (action === 'introspect') {
    createMemo(['action', EventAction.INTROSPECT], 'introspect');
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
