import Server, {
  type CommonDefinition,
  type CommonHandler,
  type CommonPlugin,
  type Plugin,
  type PluginDefinition,
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
  type CommonDefinition,
  type CommonHandler,
  type CommonPlugin,
  type Plugin,
  type PluginDefinition,
  type PluginHandler,
  type PluginRequest,
  type PluginResponse,
  type RpcType,
};
