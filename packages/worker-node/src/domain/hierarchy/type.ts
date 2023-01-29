import { type AdapterType } from '../adapter';

type HierarchyLevel = 'environment' | 'database' | 'table' | 'row';

interface HierarchySnapshot {
  table: string;
  rows: unknown[];
}

interface HierarchyDatabase {
  name: string;
  snapshots: HierarchySnapshot[];
}

interface HierarchyEnvironment {
  type: AdapterType | '';
  databases: HierarchyDatabase[];
}

export {
  type HierarchyDatabase,
  type HierarchyEnvironment,
  type HierarchyLevel,
  type HierarchySnapshot,
};
