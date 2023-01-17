type ContextType = 'mariadb' | 'mysql:8' | 'sqlite';

type ContextAction = 'save' | 'remove' | 'read' | 'write' | 'root';

interface ContextEventItem<T> {
  action: ContextAction;
  target: string;
  values: T[];
}

interface ContextResultItem<T> {
  time: number;
  table: string;
  rows: T[];
}

export {
  type ContextAction,
  type ContextEventItem,
  type ContextResultItem,
  type ContextType,
};
