import { type ClientEvent, type ClientType } from '../client';

class Context {
  private name: string;
  private events: ClientEvent<unknown>[];
  private type: ClientType;

  constructor(
    type: ClientType,
    name?: string,
    events?: ClientEvent<unknown>[],
  ) {
    this.type = type;
    this.name = name || '';
    this.events = events || [];
  }
}

export { Context };
