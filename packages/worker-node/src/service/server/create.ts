import { Server } from '../../domain';
import { createMemo } from '../memo';

const service = async (
  type: 'http' | 'rpc',
  port: number,
  hostname?: string,
): Promise<Server | null> => {
  const server = createMemo(['server', port], new Server(type));
  return server?.listen(port, hostname) || null;
};

export default service;
