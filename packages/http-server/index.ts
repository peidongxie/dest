import { Cors, Router } from './plugins';
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
  type HttpType,
  type Plugin,
  type PluginHandler,
  type RequestWrapped,
  type ResponseWrapped,
  type ServerOptions,
  type ServerType,
};
