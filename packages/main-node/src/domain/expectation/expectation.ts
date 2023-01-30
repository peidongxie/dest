import { type ClientSnapshot } from '../client';
import { type ExpectationPart } from './type';

class Expectation<T> {
  private time: number;
  private parts: ExpectationPart<T>[];
  private snapshots: ClientSnapshot[];

  constructor(
    time: number,
    parts: ExpectationPart<T>[],
    snapshots?: ClientSnapshot[],
  ) {
    this.time = time;
    this.parts = parts;
    this.snapshots = snapshots || [];
  }
}

export { Expectation };
