import { type Actuality } from '../../domain';
import { readMemo } from '../memo';

const readActuality = <T>(uuid: string): Actuality<T> | null => {
  return readMemo<Actuality<T>>(['actuality', uuid]);
};

export { readActuality };
