import { type ClientSnapshot } from '../client';

interface ExpectationPart<T> {
  count: number;
  rows: T[];
}

interface Expectation<T> {
  uuid: string;
  parts: ExpectationPart<T>[];
  snapshots: ClientSnapshot[];
}

export { type Expectation, type ExpectationPart };
