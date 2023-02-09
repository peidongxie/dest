import { type ClientSnapshot } from '../client';

interface AssertionCondition {
  query: string;
  values: unknown[];
  tables: string[];
}

interface AssertionActuality<T> {
  uuid: string;
  snapshots: ClientSnapshot<unknown>[];
  rows: T[];
  error: string;
  time: number;
}

interface AssertionPart<T> {
  count: number;
  rows: T[];
}

interface AssertionExpectation<T> {
  uuid: string;
  snapshots: ClientSnapshot<unknown>[];
  parts: AssertionPart<T>[];
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
