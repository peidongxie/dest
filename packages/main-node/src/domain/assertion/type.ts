import { type ClientSnapshot } from '../client';

interface AssertionCondition {
  query: string;
  values: unknown[];
  tables: string[];
}

interface AssertionActuality<T> {
  uuid: string;
  error: string;
  rows: T[];
  snapshots: ClientSnapshot<unknown>[];
  time: number;
}

interface AssertionPart<T> {
  count: number;
  rows: T[];
}

interface AssertionExpectation<T> {
  uuid: string;
  parts: AssertionPart<T>[];
  snapshots: ClientSnapshot<unknown>[];
}

interface AssertionDifference<A extends E, E> {
  table: string;
  index: number;
  row: A | Record<string, never>;
  rows: E[];
}

export {
  type AssertionActuality,
  type AssertionCondition,
  type AssertionDifference,
  type AssertionExpectation,
  type AssertionPart,
};
