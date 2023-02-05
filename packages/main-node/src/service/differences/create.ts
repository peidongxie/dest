import { type Difference, type ExpectationPart } from '../../domain';
import { readActuality } from '../actuality';
import { readExpectation } from '../expectation';

const createCheck = (
  actualityRow: unknown,
  expectationRow: unknown,
): boolean => {
  return true;
};

const createDifference = <A extends E, E>(
  actualityPart: ExpectationPart<A>,
  expectationPart: ExpectationPart<E>,
  table = '',
): Difference<A, E> | null => {
  const rows = [...expectationPart.rows];
  for (let index = 0; index < actualityPart.count; index++) {
    const row = actualityPart.rows[index];
    const match = rows.findIndex((expectationRow) =>
      createCheck(row, expectationRow),
    );
    if (match === -1) {
      return {
        table,
        index,
        row,
        rows,
      };
    }
    rows.splice(match, 1);
  }
  if (actualityPart.count !== expectationPart.count) {
    return {
      table,
      index: actualityPart.count,
      row: {},
      rows,
    };
  }
  return null;
};

const createDifferences = (
  actualityUuid: string,
  expectationUuid: string,
): Difference<unknown, unknown>[] | null => {
  const actuality = readActuality(actualityUuid);
  if (!actuality) return null;
  const expectation = readExpectation(expectationUuid);
  if (!expectation) return null;
  const differences = [];
  for (const expectationPart of expectation.parts) {
    const actualityPart = {
      count: actuality.rows.length,
      rows: actuality.rows,
    };
    const difference = createDifference(actualityPart, expectationPart);
    if (difference) {
      differences.push(difference);
      break;
    }
  }
  for (const expectationSnapshot of expectation.snapshots) {
    const actualitySnapshot = actuality.snapshots.find(
      (actualitySnapshot) =>
        actualitySnapshot.table === expectationSnapshot.table,
    );
    const actualityPart = {
      count: actualitySnapshot?.rows.length || 0,
      rows: actualitySnapshot?.rows || [],
    };
    const expectationPart = {
      count: expectationSnapshot.rows.length,
      rows: expectationSnapshot.rows,
    };
    const difference = createDifference(
      actualityPart,
      expectationPart,
      expectationSnapshot.table,
    );
    if (difference) {
      differences.push(difference);
    }
  }
  return differences;
};

export { createDifference, createDifferences };
