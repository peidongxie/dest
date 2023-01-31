import { type ClientEvent, type ClientType } from '../client';

interface Context {
  name: string;
  events: ClientEvent<unknown>[];
  type: ClientType;
}

export { type Context };
