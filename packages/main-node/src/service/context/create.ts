import { Context, type ClientEvent, type ClientType } from '../../domain';
import { createMemo } from '../memo';

const createContext = (
  type: ClientType,
  name: string,
  events: ClientEvent<unknown>[],
): Context | null => {
  const context = { type, name, events };
  return createMemo(['context', type, name], context);
};

export { createContext };
