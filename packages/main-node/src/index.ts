import assert from 'assert';
import {
  deleteActualityByHttp,
  deleteActualityByRpc,
  deleteClientByHttp,
  deleteClientByRpc,
  deleteContextByHttp,
  deleteContextByRpc,
  deleteExpectationByHttp,
  deleteExpectationByRpc,
  getActualityByHttp,
  getActualityByRpc,
  getClientByHttp,
  getClientByRpc,
  getContextByHttp,
  getContextByRpc,
  getExpectationByHttp,
  getExpectationByRpc,
  postActualityByHttp,
  postActualityByRpc,
  postAssertionByHttp,
  postAssertionByRpc,
  postClientByHttp,
  postClientByRpc,
  postContextByHttp,
  postContextByRpc,
  postExpectationByHttp,
  postExpectationByRpc,
  putContextByHttp,
  putContextByRpc,
} from './controller';
import {
  ActionEnum,
  TypeEnum,
  type ClientAction,
  type ClientType,
} from './domain';
import {
  createAction,
  createEnum,
  createSecret,
  createServer,
  createType,
} from './service';

const actions: ClientAction[] = [
  'save',
  'remove',
  'read',
  'write',
  'root',
  'introspect',
];
for (const action of actions) {
  const key = ActionEnum[action.toUpperCase() as Uppercase<ClientAction>];
  key && createAction(key, action);
  key && createEnum(action, key);
}

const types: ClientType[] = ['mariadb', 'sqlite'];
for (const type of types) {
  const key = TypeEnum[type.toUpperCase() as Uppercase<ClientType>];
  key && createType(key, type);
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
          deleteActualityByHttp,
          deleteClientByHttp,
          deleteContextByHttp,
          deleteExpectationByHttp,
          getActualityByHttp,
          getClientByHttp,
          getContextByHttp,
          getExpectationByHttp,
          postActualityByHttp,
          postAssertionByHttp,
          postClientByHttp,
          postContextByHttp,
          postExpectationByHttp,
          putContextByHttp,
        ],
        port,
        '::',
      )
    : call === 'rpc'
    ? await createServer(
        [
          deleteActualityByRpc,
          deleteClientByRpc,
          deleteContextByRpc,
          deleteExpectationByRpc,
          getActualityByRpc,
          postAssertionByRpc,
          getClientByRpc,
          getContextByRpc,
          getExpectationByRpc,
          postActualityByRpc,
          postClientByRpc,
          postContextByRpc,
          postExpectationByRpc,
          putContextByRpc,
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
