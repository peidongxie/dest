import {
  type ActionEnum,
  type ClientAction,
  type ClientType,
} from '../../domain';
import { createMemo } from '../memo';

const createAction = (key: unknown, value: ClientAction): void => {
  createMemo(['constant', 'action', Number(key)], value);
};

const createEnum = (key: unknown, value: ActionEnum): void => {
  createMemo(['constant', 'enum', String(key)], value);
};

const createSecret = (value: string): void => {
  createMemo(['constant', 'secret'], value);
};

const createType = (key: unknown, value: ClientType): void => {
  createMemo(['constant', 'type', Number(key)], value);
};

export { createAction, createEnum, createSecret, createType };
