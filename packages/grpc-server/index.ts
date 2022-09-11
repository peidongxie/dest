import Server, {
  type Plugin,
  type PluginHandler,
  type PluginRequest,
  type PluginResponse,
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
  type Plugin,
  type PluginHandler,
  type PluginRequest,
  type PluginResponse,
  type RpcType,
};
