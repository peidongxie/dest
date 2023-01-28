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
import {
  ActionEnum,
  LevelEnum,
  TypeEnum,
  type AdapterType,
  type DatabaseAction,
  type HierarchyLevel,
} from './domain';
import { createMemo, createServer } from './service';

const config = {
  database: ['sqlite'] as AdapterType[],
  hierarchy: ['environment', 'database', 'table', 'row'] as HierarchyLevel[],
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
    createMemo(['type', TypeEnum.MARIADB], 'mariadb');
  }
  if (type === 'mysql:8') {
    createMemo(['type', TypeEnum.MYSQL8], 'mysql:8');
  }
  if (type === 'sqlite') {
    createMemo(['type', TypeEnum.SQLITE], 'sqlite');
  }
}

for (const level of config.hierarchy) {
  if (level === 'environment') {
    createMemo(['level', LevelEnum.ENVIRONMENT], 'environment');
  }
  if (level === 'database') {
    createMemo(['level', LevelEnum.DATABASE], 'database');
  }
  if (level === 'table') {
    createMemo(['level', LevelEnum.TABLE], 'table');
  }
  if (level === 'row') {
    createMemo(['level', LevelEnum.ROW], 'row');
  }
}

for (const action of config.query) {
  if (action === 'save') {
    createMemo(['action', ActionEnum.SAVE], 'save');
  }
  if (action === 'remove') {
    createMemo(['action', ActionEnum.REMOVE], 'remove');
  }
  if (action === 'read') {
    createMemo(['action', ActionEnum.READ], 'read');
  }
  if (action === 'write') {
    createMemo(['action', ActionEnum.WRITE], 'write');
  }
  if (action === 'root') {
    createMemo(['action', ActionEnum.ROOT], 'root');
  }
  if (action === 'introspect') {
    createMemo(['action', ActionEnum.INTROSPECT], 'introspect');
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
