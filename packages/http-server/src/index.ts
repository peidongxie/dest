import {
  type Handler,
  type HandlerRequest,
  type HandlerResponse,
} from './handler';
import { MultipartFile } from './request';
import { JsonItem } from './response';
import Server, {
  type HttpType,
  type ServerOptions,
  type ServerType,
} from './server';

const createServer = <T extends HttpType = 'HTTP'>(
  type: ServerType<T>,
  options?: ServerOptions<T>,
): Server<T> => {
  return new Server(type, options);
};

export {
  Server,
  createServer,
  type Handler,
  type HandlerRequest,
  type HandlerResponse,
  type JsonItem,
  type MultipartFile,
};
