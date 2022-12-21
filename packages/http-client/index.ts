import Client, {
  type ClientOptions,
  type RequestWrapped,
  type ResponseWrapped,
} from './client';
import { Router, type Route } from './plugins';

const createClient = (
  ...args: ConstructorParameters<typeof Client>
): Client => {
  return new Client(...args);
};

export {
  Client,
  Router,
  createClient,
  type ClientOptions,
  type RequestWrapped,
  type ResponseWrapped,
  type Route,
};
