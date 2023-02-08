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
  actions: [
    'save',
    'remove',
    'read',
    'write',
    'root',
    'introspect',
  ] as DatabaseAction[],
  levels: ['environment', 'database', 'table', 'row'] as HierarchyLevel[],
  types: ['sqlite'] as AdapterType[],
  server: {
    3001: 'http',
    3002: 'rpc',
  } as Record<number, 'http' | 'rpc'>,
};

for (const action of config.actions) {
  const key = ActionEnum[action.toUpperCase() as Uppercase<DatabaseAction>];
  key && createAction(key, action);
}

for (const level of config.levels) {
  const key = LevelEnum[level.toUpperCase() as Uppercase<HierarchyLevel>];
  key && createLevel(key, level);
}

for (const type of config.types) {
  const key = TypeEnum[type.toUpperCase() as Uppercase<AdapterType>];
  key && createType(key, type);
  key && createEnum(type, key);
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
