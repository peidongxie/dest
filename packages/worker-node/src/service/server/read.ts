import { Server } from '../../domain';
import { readMemo } from '../memo';

const readServer = (type: 'http' | 'rpc', port: number): Server | null => {
  return readMemo<Server>(['server', port]);
};

export { readServer };
