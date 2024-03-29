import assert from 'assert';
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
  createSecret,
  createServer,
  createType,
} from './service';

const actions: DatabaseAction[] = [
  'save',
  'remove',
  'read',
  'write',
  'root',
  'introspect',
];
for (const action of actions) {
  const key = ActionEnum[action.toUpperCase() as Uppercase<DatabaseAction>];
  key && createAction(key, action);
}

const levels: HierarchyLevel[] = ['environment', 'database', 'table', 'row'];
for (const level of levels) {
  const key = LevelEnum[level.toUpperCase() as Uppercase<HierarchyLevel>];
  key && createLevel(key, level);
}

const types: AdapterType[] = ['mariadb', 'mssql', 'sqlite'];
for (const type of types) {
  const key = TypeEnum[type.toUpperCase() as Uppercase<AdapterType>];
  key && createType(key, type);
  key && createEnum(type, key);
}

const secret = process.env.APP_SECRET || '';
createSecret(secret);

const call = process.env.APP_CALL || 'http';
const port = Number(process.env.APP_PORT);
assert(call === 'http' || call === 'rpc', 'Invalid call');
assert(Number.isInteger(port) && port > 0 && port < 65536, 'Invalid port');
const server =
  call === 'http'
    ? await createServer(
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
        port,
        '::',
      )
    : call === 'rpc'
    ? await createServer(
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
        port,
        '::',
      )
    : null;
const shutdown = async () => {
  await server?.close();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
