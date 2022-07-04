import { Cors, Router } from './plugins';
import Server, {
  type Handler,
  type HandlerRequest,
  type HandlerResponse,
  type HttpType,
  type Plugin,
} from './server';

const createServer = <T extends HttpType = 'HTTP'>(
  ...args: ConstructorParameters<typeof Server<T>>
): Server<T> => {
  return new Server<T>(...args);
};

export {
  Cors,
  Router,
  Server,
  createServer,
  type Handler,
  type HandlerRequest,
  type HandlerResponse,
  type HttpType,
  type Plugin,
};
