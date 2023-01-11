import { type Server } from '../../domain';
import { readMemo } from '../memo';

const readServer = (port: number): Server | null => {
  return readMemo<Server>(['server', port.toString()]);
};

export { readServer };
