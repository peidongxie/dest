import { Server } from '../../domain';
import { createPool } from '../pool';

const service = async (
  type: 'http' | 'rpc',
  port: number,
  hostname?: string,
): Promise<Server | null> => {
  const server = createPool(['server', port], new Server(type));
  return server?.listen(port, hostname) || null;
};

export default service;
