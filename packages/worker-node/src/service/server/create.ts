import { Server } from '../../domain';

const service = async (
  type: 'http' | 'rpc',
  port: number,
  hostname?: string,
): Promise<Server | null> => {
  const server = Server.store.get(port) || null;
  if (server) return null;
  return new Server(type).listen(port, hostname);
};

export default service;
