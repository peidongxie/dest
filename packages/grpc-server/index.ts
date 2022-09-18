import Server, {
  type CommonHandler,
  type CommonPlugin,
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
  type CommonHandler,
  type CommonPlugin,
  type Plugin,
  type PluginHandler,
  type PluginRequest,
  type PluginResponse,
  type RpcType,
};
