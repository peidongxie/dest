import { type Expectation } from '../../domain';
import { deleteMemo } from '../memo';

const deleteExpectation = <T>(uuid: string): Expectation<T> | null => {
  return deleteMemo<Expectation<T>>(['expectation', uuid]);
};

export { deleteExpectation };
