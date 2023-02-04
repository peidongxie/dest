import {
  type AdapterType,
  type DatabaseAction,
  type HierarchyLevel,
  type TypeEnum,
} from '../../domain';
import { createMemo } from '../memo';

const createAction = (key: unknown, value: DatabaseAction): void => {
  createMemo(['constant', 'action', Number(key)], value);
};

const createEnum = (key: unknown, value: TypeEnum): void => {
  createMemo(['constant', 'enum', String(key)], value);
};

const createLevel = (key: unknown, value: HierarchyLevel): void => {
  createMemo(['constant', 'level', Number(key)], value) || '';
};

const createSecret = (value: string): void => {
  createMemo(['constant', 'secret'], value);
};

const createType = (key: unknown, value: AdapterType): void => {
  createMemo(['constant', 'type', Number(key)], value);
};

export { createAction, createEnum, createLevel, createSecret, createType };
