type DatabaseAction =
  | 'save'
  | 'remove'
  | 'read'
  | 'write'
  | 'root'
  | 'introspect';

interface DatabaseEvent<T> {
  action: DatabaseAction;
  target: string;
  values: T[];
}

interface DatabaseResult<T> {
  time: number;
  error: string;
  rows: T[];
}

export { type DatabaseAction, type DatabaseEvent, type DatabaseResult };
