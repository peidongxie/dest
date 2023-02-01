import { randomUUID } from 'crypto';
import {
  type ClientSnapshot,
  type Expectation,
  type ExpectationPart,
} from '../../domain';
import { createMemo } from '../memo';

const createExpectation = <T>(
  parts: ExpectationPart<T>[],
  snapshots?: ClientSnapshot[],
): Expectation<T> | null => {
  const uuid = randomUUID();
  return createMemo(['expectation', uuid], {
    uuid,
    parts,
    snapshots: snapshots || [],
  });
};

export { createExpectation };
