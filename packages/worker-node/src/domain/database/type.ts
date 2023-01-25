import { AdapterType } from '../adapter';

type DatabaseAction = 'save' | 'remove' | 'read' | 'write' | 'root';

interface DatabaseEventItem<T> {
  action: DatabaseAction;
  target: string;
  values: T[];
  tables: string[];
}

interface DatabaseSnapshotItem<T> {
  table: string;
  rows: T[];
}

interface DatabaseHierarchy {
  type: AdapterType;
  databases: {
    name: string;
    snapshots: DatabaseSnapshotItem<unknown>[];
  }[];
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
  type DatabaseHierarchy,
  type DatabaseResult,
  type DatabaseSnapshotItem,
};
