import {
  deleteClientByHttp,
  deleteClientByRpc,
  getClientByHttp,
  getClientByRpc,
  postClientByHttp,
  postClientByRpc,
} from './controller';
import { createServer } from './service';

const config = {
  server: {
    3003: 'http',
    3004: 'rpc',
  } as Record<number, 'http' | 'rpc'>,
};

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
