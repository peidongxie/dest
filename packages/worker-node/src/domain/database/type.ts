type DatabaseAction = 'save' | 'remove' | 'read' | 'write' | 'root';

interface DatabaseEventItem<T> {
  action: DatabaseAction;
  target: string;
  values: T[];
}

interface DatabaseResultItem<T> {
  time: number;
  table: string;
  rows: T[];
}

export { type DatabaseAction, type DatabaseEventItem, type DatabaseResultItem };
