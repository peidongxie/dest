import Server, {
  type Plugin,
  type PluginHandler,
  type ProtoDefinition,
  type ProtoMethod,
  type ReqMsg,
  type RequestWrapped,
  type ResMsg,
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
  type ProtoDefinition,
  type ProtoMethod,
  type ReqMsg,
  type RequestWrapped,
  type ResMsg,
  type ResponseWrapped,
  type RpcType,
  type ServerOptions,
};
