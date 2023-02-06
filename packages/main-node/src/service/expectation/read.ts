import { type AssertionExpectation } from '../../domain';
import { readMemo } from '../memo';

const readExpectation = <T>(uuid: string): AssertionExpectation<T> | null => {
  return readMemo<AssertionExpectation<T>>(['expectation', uuid]);
};

export { readExpectation };
