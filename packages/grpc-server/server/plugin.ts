import { type MethodDefinition } from '@grpc/grpc-js';
import { type PluginRequest } from './request';
import { type PluginResponse } from './response';
import { type RpcType } from './type';

interface PluginDefinitionMap<ReqMsg, ResMsg> {
  UNARY: MethodDefinition<ReqMsg, ResMsg> & {
    requestStream: false;
    responseStream: false;
  };
  SERVER: MethodDefinition<ReqMsg, ResMsg> & {
    requestStream: false;
    responseStream: true;
  };
  CLIENT: MethodDefinition<ReqMsg, ResMsg> & {
    requestStream: true;
    responseStream: false;
  };
  BIDI: MethodDefinition<ReqMsg, ResMsg> & {
    requestStream: true;
    responseStream: true;
  };
}

type PluginDefinition<T extends RpcType, ReqMsg, ResMsg> = PluginDefinitionMap<
  ReqMsg,
  ResMsg
>[T];

type CommonDefinition<
  T extends RpcType = RpcType,
  ReqMsg = unknown,
  ResMsg = unknown,
> = T extends RpcType ? PluginDefinition<T, ReqMsg, ResMsg> : never;

type PluginHandler<T extends RpcType, ReqMsg, ResMsg> = (
  req: PluginRequest<T, ReqMsg>,
) => PluginResponse<T, ResMsg> | Promise<PluginResponse<T, ResMsg>>;

type CommonHandler<
  T extends RpcType = RpcType,
  ReqMsg = unknown,
  ResMsg = unknown,
> = T extends RpcType ? PluginHandler<T, ReqMsg, ResMsg> : never;

interface Plugin<T extends RpcType, ReqMsg, ResMsg> {
  definition: PluginDefinition<T, ReqMsg, ResMsg>;
  handler: PluginHandler<T, ReqMsg, ResMsg>;
}

type CommonPlugin<
  T extends RpcType = RpcType,
  ReqMsg = unknown,
  ResMsg = unknown,
> = T extends RpcType ? Plugin<T, ReqMsg, ResMsg> : never;

export {
  type CommonDefinition,
  type CommonHandler,
  type CommonPlugin,
  type Plugin,
  type PluginDefinition,
  type PluginHandler,
};
