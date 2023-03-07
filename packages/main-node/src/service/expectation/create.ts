import { nanoid } from 'nanoid';
import {
  type AssertionExpectation,
  type AssertionPart,
  type ClientSnapshot,
} from '../../domain';
import { createMemo } from '../memo';

const createExpectation = <T>(
  snapshots: ClientSnapshot<unknown>[],
  parts: AssertionPart<T>[],
): AssertionExpectation<T> | null => {
  const uuid = nanoid();
  return createMemo(['expectation', uuid], {
    uuid,
    snapshots: snapshots || [],
    parts,
  });
};

export { createExpectation };
