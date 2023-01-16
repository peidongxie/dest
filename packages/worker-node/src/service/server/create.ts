import { type Plugin, type ProtoDefinition } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { Server } from '../../domain';
import { createMemo } from '../memo';

const createServer = (
  api: Route[] | Plugin<ProtoDefinition>[],
  port: number,
  hostname?: string,
): Promise<Server> | null => {
  const server = createMemo(['server', port], new Server(api));
  return server?.listen(port, hostname) || null;
};

export { createServer };
