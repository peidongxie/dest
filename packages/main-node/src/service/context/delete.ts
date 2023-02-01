import { type ClientType, type Context } from '../../domain';
import { deleteMemo } from '../memo';

const deleteContext = (type: ClientType, name: string): Context | null => {
  return deleteMemo<Context>(['context', type, name]);
};

export { deleteContext };
