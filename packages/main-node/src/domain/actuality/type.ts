import { type ClientSnapshot } from '../client';

interface Actuality<T> {
  uuid: string;
  error: string;
  rows: T[];
  snapshots: ClientSnapshot<unknown>[];
  time: number;
}

interface ActualityCondition {
  query: string;
  values: unknown[];
  tables: string[];
}

export { type Actuality, type ActualityCondition };
