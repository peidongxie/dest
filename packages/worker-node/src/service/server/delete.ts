import { type Server } from '../../domain';
import { deleteMemo } from '../memo';

const deleteServer = (port: number): Promise<Server> | null => {
  const server = deleteMemo<Server>(['server', port.toString()]);
  return server?.close() || null;
};

export { deleteServer };
