type DatabaseAction =
  | 'save'
  | 'remove'
  | 'read'
  | 'write'
  | 'root'
  | 'introspect';

interface DatabaseEventItem<T> {
  action: DatabaseAction;
  target: string;
  values: T[];
  tables: string[];
}

interface DatabaseResult<T> {
  time: number;
  error: string;
  rows: T[];
}

export { type DatabaseAction, type DatabaseEventItem, type DatabaseResult };
