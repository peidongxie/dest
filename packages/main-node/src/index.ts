import {
  deleteClientByHttp,
  deleteClientByRpc,
  deleteContextByHttp,
  deleteContextByRpc,
  getClientByHttp,
  getClientByRpc,
  getContextByHttp,
  getContextByRpc,
  postClientByHttp,
  postClientByRpc,
  postContextByHttp,
  postContextByRpc,
  putContextByHttp,
  putContextByRpc,
} from './controller';
import {
  ActionEnum,
  TypeEnum,
  type ClientAction,
  type ClientType,
} from './domain';
import { createAction, createEnum, createServer, createType } from './service';

const config = {
  actions: [
    'save',
    'remove',
    'read',
    'write',
    'root',
    'introspect',
  ] as ClientAction[],
  types: ['sqlite'] as ClientType[],
  server: {
    3003: 'http',
    3004: 'rpc',
  } as Record<number, 'http' | 'rpc'>,
};

for (const action of config.actions) {
  const key = ActionEnum[action.toUpperCase() as Uppercase<ClientAction>];
  key && createAction(key, action);
  key && createEnum(action, key);
}

for (const type of config.types) {
  const key = TypeEnum[type.toUpperCase() as Uppercase<ClientType>];
  key && createType(key, type);
}

for (const [port, call] of Object.entries(config.server)) {
  if (call === 'http') {
    await createServer(
      [
        deleteClientByHttp,
        deleteContextByHttp,
        getClientByHttp,
        getContextByHttp,
        postClientByHttp,
        postContextByHttp,
        putContextByHttp,
      ],
      Number(port),
    );
  }
  if (call === 'rpc') {
    await createServer(
      [
        deleteClientByRpc,
        deleteContextByRpc,
        getClientByRpc,
        getContextByRpc,
        postClientByRpc,
        postContextByRpc,
        putContextByRpc,
      ],
      Number(port),
    );
  }
}
