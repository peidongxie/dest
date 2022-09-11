import { Cors, Router } from './plugins';
import Server, {
  type HttpType,
  type Plugin,
  type PluginHandler,
  type PluginRequest,
  type PluginResponse,
} from './server';

const createServer = <T extends HttpType>(
  ...args: ConstructorParameters<typeof Server<T>>
): Server<T> => {
  return new Server<T>(...args);
};

export {
  Cors,
  Router,
  Server,
  createServer,
  type HttpType,
  type Plugin,
  type PluginHandler,
  type PluginRequest,
  type PluginResponse,
};
