import { type Server } from '../../domain';
import { deletePool } from '../pool';

const service = async (port: number): Promise<Server | null> => {
  const server = deletePool<Server>(['server', port]);
  return server?.close() || null;
};

export default service;
