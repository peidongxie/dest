import { type ClientType, type Context } from '../../domain';
import { readMemo } from '../memo';

const readContext = (type: ClientType, name: string): Context | null => {
  return readMemo<Context>(['context', type, name]);
};

export { readContext };
