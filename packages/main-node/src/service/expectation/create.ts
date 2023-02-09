import { randomUUID } from 'crypto';
import {
  type AssertionExpectation,
  type AssertionPart,
  type ClientSnapshot,
} from '../../domain';
import { createMemo } from '../memo';

const createExpectation = <T>(
  parts: AssertionPart<T>[],
  snapshots?: ClientSnapshot<unknown>[],
): AssertionExpectation<T> | null => {
  const uuid = randomUUID();
  return createMemo(['expectation', uuid], {
    uuid,
    snapshots: snapshots || [],
    parts,
  });
};

export { createExpectation };
