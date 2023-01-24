type DatabaseAction = 'save' | 'remove' | 'read' | 'write' | 'root';

interface DatabaseEventItem<T> {
  action: DatabaseAction;
  snapshot: boolean;
  name: string;
  values: T[];
}

interface DatabaseSnapshotItem<T> {
  name: string;
  values: T[];
}

interface DatabaseResult<T> {
  time: number;
  error: string;
  rows: T[];
  snapshots: DatabaseSnapshotItem<unknown>[];
}

export {
  type DatabaseAction,
  type DatabaseEventItem,
  type DatabaseResult,
  type DatabaseSnapshotItem,
};
