import {
  type AdapterType,
  type DatabaseAction,
  type HierarchyLevel,
  type TypeEnum,
} from '../../domain';
import { readMemo, readMemos } from '../memo';

const readAction = (key: unknown): DatabaseAction | '' => {
  return readMemo<DatabaseAction>(['constant', 'action', Number(key)]) || '';
};

const readEnum = (key: unknown): TypeEnum => {
  return readMemo<TypeEnum>(['constant', 'enum', String(key)]) || 0;
};

const readLevel = (key: unknown): HierarchyLevel | '' => {
  return readMemo<HierarchyLevel>(['constant', 'level', Number(key)]) || '';
};

const readSecret = (): string => {
  return readMemo<string>(['constant', 'secret']) || '';
};

const readType = (key: unknown): AdapterType | '' => {
  return readMemo<AdapterType>(['constant', 'type', Number(key)]) || '';
};

const readTypes = (): AdapterType[] => {
  return readMemos<AdapterType>(['constant', 'type']);
};

export { readAction, readEnum, readLevel, readSecret, readType, readTypes };
