type ContextType = 'mariadb' | 'mysql:8' | 'sqlite';

type ContextLevel = 'environment' | 'database' | 'table' | 'row';

type ContextAction =
  | 'save'
  | 'remove'
  | 'read'
  | 'write'
  | 'root'
  | 'introspect';

interface ContextSnapshot {
  table: string;
  rows: unknown[];
}

interface ContextDatabase {
  name: string;
  snapshots: ContextSnapshot[];
}

interface ContextEnvironment {
  type: ContextType | '';
  databases: ContextDatabase[];
}

interface ContextEvent<T> {
  action: ContextAction;
  target: string;
  values: T[];
}

interface ContextResult<T> {
  time: number;
  error: string;
  rows: T[];
}

interface ContextExpectation<T> {
  time: number;
  table: string;
  checkpoints: {
    count: number;
    values: T[];
  }[];
}

export {
  type ContextAction,
  type ContextDatabase,
  type ContextEnvironment,
  type ContextEvent,
  type ContextLevel,
  type ContextResult,
  type ContextSnapshot,
  type ContextType,
};
