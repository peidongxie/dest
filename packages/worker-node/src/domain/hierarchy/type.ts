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
  type: string;
  databases: HierarchyDatabase[];
}

export {
  type HierarchyDatabase,
  type HierarchyEnvironment,
  type HierarchyLevel,
  type HierarchySnapshot,
};
