interface Difference<A extends E, E> {
  table: string;
  index: number;
  row: A | Record<string, never>;
  rows: E[];
}

export { type Difference };
