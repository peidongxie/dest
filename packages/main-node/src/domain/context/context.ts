import { type ContextEvent, type ContextType } from './type';

class Context {
  private name: string;
  private events: ContextEvent<unknown>[];
  private type: ContextType;

  constructor(
    type: ContextType,
    name?: string,
    events?: ContextEvent<unknown>[],
  ) {
    this.type = type;
    this.name = name || '';
    this.events = events || [];
  }
}

export { Context };
