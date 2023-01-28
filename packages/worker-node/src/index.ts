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
    createMemo(['enum', 'mariadb'], TypeEnum.MARIADB);
  }
  if (type === 'mysql:8') {
    createMemo(['type', TypeEnum.MYSQL8], 'mysql:8');
    createMemo(['enum', 'mysql:8'], TypeEnum.MYSQL8);
  }
  if (type === 'sqlite') {
    createMemo(['type', TypeEnum.SQLITE], 'sqlite');
    createMemo(['enum', 'sqlite'], TypeEnum.SQLITE);
  }
}

for (const level of config.hierarchy) {
  if (level === 'environment') {
    createMemo(['level', LevelEnum.ENVIRONMENT], 'environment');
    createMemo(['enum', 'environment'], LevelEnum.ENVIRONMENT);
  }
  if (level === 'database') {
    createMemo(['level', LevelEnum.DATABASE], 'database');
    createMemo(['enum', 'database'], LevelEnum.DATABASE);
  }
  if (level === 'table') {
    createMemo(['level', LevelEnum.TABLE], 'table');
    createMemo(['enum', 'table'], LevelEnum.TABLE);
  }
  if (level === 'row') {
    createMemo(['level', LevelEnum.ROW], 'row');
    createMemo(['enum', 'row'], LevelEnum.ROW);
  }
}

for (const action of config.query) {
  if (action === 'save') {
    createMemo(['action', ActionEnum.SAVE], 'save');
    createMemo(['enum', 'save'], ActionEnum.SAVE);
  }
  if (action === 'remove') {
    createMemo(['action', ActionEnum.REMOVE], 'remove');
    createMemo(['enum', 'remove'], ActionEnum.REMOVE);
  }
  if (action === 'read') {
    createMemo(['action', ActionEnum.READ], 'read');
    createMemo(['enum', 'read'], ActionEnum.READ);
  }
  if (action === 'write') {
    createMemo(['action', ActionEnum.WRITE], 'write');
    createMemo(['enum', 'write'], ActionEnum.WRITE);
  }
  if (action === 'root') {
    createMemo(['action', ActionEnum.ROOT], 'root');
    createMemo(['enum', 'root'], ActionEnum.ROOT);
  }
  if (action === 'introspect') {
    createMemo(['action', ActionEnum.INTROSPECT], 'introspect');
    createMemo(['enum', 'introspect'], ActionEnum.INTROSPECT);
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
