import { type Expectation } from '../../domain';
import { readMemo } from '../memo';

const readExpectation = <T>(uuid: string): Expectation<T> | null => {
  return readMemo<Expectation<T>>(['expectation', uuid]);
};

export { readExpectation };
