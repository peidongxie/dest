import { type ContextEvent, type ContextType } from './type';

class Context {
  private name: string;
  private events: ContextEvent[];
  private type: ContextType;

  constructor(type: ContextType, name?: string, events?: ContextEvent[]) {
    this.type = type;
    this.name = name || '';
    this.events = events || [];
  }
}

export { Context, type ContextEvent, type ContextType };
