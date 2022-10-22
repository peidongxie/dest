import Server, {
  type Plugin,
  type PluginDefinition,
  type PluginHandler,
  type RequestWrapped,
  type ResponseWrapped,
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
  type PluginDefinition,
  type PluginHandler,
  type RequestWrapped,
  type ResponseWrapped,
  type RpcType,
};
