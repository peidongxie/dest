type ContextType = 'mariadb' | 'mysql:8' | 'sqlite';

interface ContextEvent {
  action: 'save' | 'remove' | 'read' | 'write' | 'root';
  target: string;
  values: unknown[];
}

export { type ContextEvent, type ContextType };
