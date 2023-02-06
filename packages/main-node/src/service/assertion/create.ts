import {
  type AssertionDifference,
  type AssertionPart,
  type ClientSnapshot,
} from '../../domain';
import { readActuality } from '../actuality';
import { readExpectation } from '../expectation';

const createAssertionCheck = (
  actualityRow: unknown,
  expectationRow: unknown,
): boolean => {
  if (actualityRow === expectationRow) return true;
  if (!actualityRow || typeof actualityRow !== 'object') return false;
  if (!expectationRow || typeof expectationRow !== 'object') return false;
  return Object.entries(expectationRow).every(([key]) =>
    createAssertionCheck(
      (actualityRow as Record<typeof key, unknown>)[key],
      (expectationRow as Record<typeof key, unknown>)[key],
    ),
  );
};

const createAssertionDifference = <A extends E, E>(
  actualitySnapshot: ClientSnapshot<A>,
  expectationPart: AssertionPart<E>,
): AssertionDifference<A, E> | null => {
  const difference: AssertionDifference<A, E> = {
    table: actualitySnapshot.table,
    index: 0,
    row: actualitySnapshot.rows[0] || {},
    rows: [...expectationPart.rows],
  };
  while (difference.index < actualitySnapshot.rows.length) {
    const index = difference.rows.findIndex((row) =>
      createAssertionCheck(difference.row, row),
    );
    if (index === -1) return difference;
    difference.index++;
    difference.row = actualitySnapshot.rows[difference.index] || {};
    difference.rows.splice(index, 1);
  }
  return actualitySnapshot.rows.length === expectationPart.count
    ? null
    : difference;
};

const createAssertion = (
  actualityUuid: string,
  expectationUuid: string,
): AssertionDifference<unknown, unknown>[] | null => {
  const actuality = readActuality(actualityUuid);
  if (!actuality) return null;
  const expectation = readExpectation(expectationUuid);
  if (!expectation) return null;
  const differences = [];
  let start = 0;
  for (const expectationPart of expectation.parts) {
    const end = start + expectationPart.count;
    const actualitySnapshot = {
      table: '',
      rows: actuality.rows.slice(start, end),
    };
    start = end;
    const difference = createAssertionDifference(
      actualitySnapshot,
      expectationPart,
    );
    if (!difference) continue;
    differences.push(difference);
    break;
  }
  for (const expectationSnapshot of expectation.snapshots) {
    const actualitySnapshot = actuality.snapshots.find(
      (actualitySnapshot) =>
        actualitySnapshot.table === expectationSnapshot.table,
    ) || {
      table: expectationSnapshot.table,
      rows: [],
    };
    const expectationPart = {
      count: expectationSnapshot.rows.length,
      rows: expectationSnapshot.rows,
    };
    const difference = createAssertionDifference(
      actualitySnapshot,
      expectationPart,
    );
    if (!difference) continue;
    differences.push(difference);
  }
  return differences;
};

export { createAssertion, createAssertionCheck, createAssertionDifference };
