import Server, {
  type Definition,
  type Handler,
  type HandlerRequest,
  type HandlerResponse,
  type Plugin,
  type RpcType,
} from './server';

const createServer = (
  ...args: ConstructorParameters<typeof Server>
): Server => {
  return new Server(...args);
};

export {
  Server,
  createServer,
  type Definition,
  type Handler,
  type HandlerRequest,
  type HandlerResponse,
  type Plugin,
  type RpcType,
};
