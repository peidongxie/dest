import { type AssertionExpectation } from '../../domain';
import { deleteMemo } from '../memo';

const deleteExpectation = <T>(uuid: string): AssertionExpectation<T> | null => {
  return deleteMemo<AssertionExpectation<T>>(['expectation', uuid]);
};

export { deleteExpectation };
