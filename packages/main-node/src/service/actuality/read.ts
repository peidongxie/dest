import { type AssertionActuality } from '../../domain';
import { readMemo } from '../memo';

const readActuality = <T>(uuid: string): AssertionActuality<T> | null => {
  return readMemo<AssertionActuality<T>>(['actuality', uuid]);
};

export { readActuality };
