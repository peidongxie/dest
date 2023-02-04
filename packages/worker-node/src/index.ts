import {
  deleteAgentByHttp,
  deleteAgentByRpc,
  deleteDatabaseByHttp,
  deleteDatabaseByRpc,
  getAgentByHttp,
  getAgentByRpc,
  getDatabaseByHttp,
  getDatabaseByRpc,
  getHierarchyByHttp,
  getHierarchyByRpc,
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
import {
  createAction,
  createEnum,
  createLevel,
  createServer,
  createType,
} from './service';

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
  const key = TypeEnum[type.toUpperCase() as Uppercase<AdapterType>];
  key && createType(key, type);
  key && createEnum(type, key);
}

for (const level of config.hierarchy) {
  const key = LevelEnum[level.toUpperCase() as Uppercase<HierarchyLevel>];
  key && createLevel(key, level);
}

for (const action of config.query) {
  const key = ActionEnum[action.toUpperCase() as Uppercase<DatabaseAction>];
  key && createAction(key, action);
}

for (const [port, call] of Object.entries(config.server)) {
  if (call === 'http') {
    await createServer(
      [
        deleteAgentByHttp,
        deleteDatabaseByHttp,
        getAgentByHttp,
        getDatabaseByHttp,
        getHierarchyByHttp,
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
        getHierarchyByRpc,
        postAgentByRpc,
        postDatabaseByRpc,
        postQueryByRpc,
      ],
      Number(port),
    );
  }
}
