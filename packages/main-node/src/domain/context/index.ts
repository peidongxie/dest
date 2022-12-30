import { type ContextType, type ContextTypeAlias } from './type';

const contextMapper: Record<ContextTypeAlias, ContextType> = {
  2049: 'sqlite',
  3306: 'mariadb',
  3307: 'mysql:8',
  93307: 'mysql:8',
};

interface ContextStep {
  action: 'save' | 'remove' | 'query';
  name: string;
  data: unknown[];
}

class Context {
  private name: string;
  private steps: ContextStep[];
  private type: ContextType;

  constructor(type: ContextType, name?: string, steps?: ContextStep[]) {
    this.type = type;
    this.name = name || '';
    this.steps = steps || [];
  }
}

export { Context, contextMapper, type ContextType, type ContextTypeAlias };
