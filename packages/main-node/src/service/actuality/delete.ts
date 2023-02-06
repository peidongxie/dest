import { type AssertionActuality } from '../../domain';
import { deleteMemo } from '../memo';

const deleteActuality = <T>(uuid: string): AssertionActuality<T> | null => {
  return deleteMemo<AssertionActuality<T>>(['actuality', uuid]);
};

export { deleteActuality };
