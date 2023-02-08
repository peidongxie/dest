import {
  type ActionEnum,
  type ClientAction,
  type ClientType,
} from '../../domain';
import { readMemo, readMemos } from '../memo';

const readAction = (key: unknown): ClientAction | '' => {
  return readMemo<ClientAction>(['constant', 'action', Number(key)]) || '';
};

const readEnum = (key: unknown): ActionEnum => {
  return readMemo<ActionEnum>(['constant', 'enum', String(key)]) || 0;
};

const readSecret = (): string => {
  return readMemo<string>(['constant', 'secret']) || '';
};

const readType = (key: unknown): ClientType | '' => {
  return readMemo<ClientType>(['constant', 'type', Number(key)]) || '';
};

const readTypes = (): ClientType[] => {
  return readMemos<ClientType>(['constant', 'type']);
};

export { readAction, readEnum, readSecret, readType, readTypes };
