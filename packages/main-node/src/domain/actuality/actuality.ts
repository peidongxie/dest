import { type ClientResult, type ClientSnapshot } from '../client';

class Actuality<T> {
  private error: string;
  private rows: T[];
  private snapshots: ClientSnapshot[];
  private time: number;

  constructor(
    readWriteResult: ClientResult<T>,
    introspectResult?: ClientResult<ClientSnapshot>,
  ) {
    this.error = readWriteResult.error || introspectResult?.error || '';
    this.rows = readWriteResult.rows;
    this.snapshots = introspectResult?.rows || [];
    this.time = readWriteResult.time;
  }
}

export { Actuality };
