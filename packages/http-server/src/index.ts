import {
  type Handler,
  type HandlerRequest,
  type HandlerResponse,
} from './handler';
import { MultipartFile } from './request';
import { JsonItem } from './response';
import Server, { type ServerOptions } from './server';

const createServer = <Secure extends boolean, Version extends 1>(
  options?: ServerOptions<Secure, Version> & {
    secure?: Secure;
    version?: Version;
  },
): Server<Secure, Version> => {
  return new Server(options);
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
