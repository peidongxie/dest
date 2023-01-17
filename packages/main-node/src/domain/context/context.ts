import {
  type ContextAction,
  type ContextEventItem,
  type ContextType,
} from './type';

class Context {
  private name: string;
  private events: ContextEventItem<unknown>[];
  private type: ContextType;

  constructor(
    type: ContextType,
    name?: string,
    events?: ContextEventItem<unknown>[],
  ) {
    this.type = type;
    this.name = name || '';
    this.events = events || [];
  }
}

export { Context, type ContextAction, type ContextEventItem, type ContextType };
