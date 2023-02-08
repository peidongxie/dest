import {
  deleteClientByHttp,
  deleteClientByRpc,
  getClientByHttp,
  getClientByRpc,
  postClientByHttp,
  postClientByRpc,
} from './controller';
import { TypeEnum, type ClientType } from './domain';
import { createServer, createType } from './service';

const config = {
  context: [] as ClientType[],
  server: {
    3003: 'http',
    3004: 'rpc',
  } as Record<number, 'http' | 'rpc'>,
};

for (const type of config.context) {
  const key = TypeEnum[type.toUpperCase() as Uppercase<ClientType>];
  key && createType(key, type);
}

for (const [port, call] of Object.entries(config.server)) {
  if (call === 'http') {
    await createServer(
      [deleteClientByHttp, getClientByHttp, postClientByHttp],
      Number(port),
    );
  }
  if (call === 'rpc') {
    await createServer(
      [deleteClientByRpc, getClientByRpc, postClientByRpc],
      Number(port),
    );
  }
}
