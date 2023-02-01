import { type ClientSnapshot } from '../client';

interface Actuality<T> {
  uuid: string;
  error: string;
  rows: T[];
  snapshots: ClientSnapshot[];
  time: number;
}

export { type Actuality };
