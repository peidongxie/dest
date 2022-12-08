import { Cors, Router, type AllowOptions, type Route } from './plugins';
import Server, {
  type HttpType,
  type Plugin,
  type PluginHandler,
  type RequestWrapped,
  type ResponseWrapped,
  type ServerOptions,
  type ServerType,
} from './server';

const createServer = (
  ...args: ConstructorParameters<typeof Server>
): Server => {
  return new Server(...args);
};

export {
  Cors,
  Router,
  Server,
  createServer,
  type AllowOptions,
  type HttpType,
  type Plugin,
  type PluginHandler,
  type RequestWrapped,
  type ResponseWrapped,
  type Route,
  type ServerOptions,
  type ServerType,
};
