import { type Actuality } from '../../domain';
import { deleteMemo } from '../memo';

const deleteActuality = <T>(uuid: string): Actuality<T> | null => {
  return deleteMemo<Actuality<T>>(['actuality', uuid]);
};

export { deleteActuality };
