import Server, {
  type Plugin,
  type PluginHandler,
  type PluginMethod,
  type RequestWrapped,
  type ResponseWrapped,
  type RpcType,
  type ServerOptions,
} from './server';

const createServer = (
  ...args: ConstructorParameters<typeof Server>
): Server => {
  return new Server(...args);
};

export {
  Server,
  createServer,
  type Plugin,
  type PluginHandler,
  type PluginMethod,
  type RequestWrapped,
  type ResponseWrapped,
  type RpcType,
  type ServerOptions,
};
