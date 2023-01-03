type DatabaseAction = 'save' | 'remove' | 'read' | 'write' | 'root';

interface DatabaseResultItem<T> {
  time: number;
  table: string;
  rows: T[];
}

export { type DatabaseAction, type DatabaseResultItem };
