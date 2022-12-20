import { type Server } from '../../domain';
import { deleteMemo } from '../memo';

const deleteServer = async (port: number): Promise<Server | null> => {
  const server = deleteMemo<Server>(['server', port]);
  return server?.close() || null;
};

export { deleteServer };
