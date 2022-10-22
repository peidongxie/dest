import { type MethodDefinition } from '@grpc/grpc-js';
import { type RequestStream, type RequestWrapped } from './request';
import { type ResponseStream, type ResponseWrapped } from './response';
import { type RpcType } from './type';

type PluginDefinition<T extends RpcType, ReqMsg, ResMsg> = MethodDefinition<
  ReqMsg,
  ResMsg
> & {
  requestStream: RequestStream<T>;
  responseStream: ResponseStream<T>;
};

type PluginHandler<T extends RpcType, ReqMsg, ResMsg> = T extends RpcType
  ? (
      req: RequestWrapped<T, ReqMsg>,
    ) => ResponseWrapped<T, ResMsg> | Promise<ResponseWrapped<T, ResMsg>>
  : never;

type Plugin<T extends RpcType, ReqMsg, ResMsg> = T extends RpcType
  ? {
      definition: PluginDefinition<T, ReqMsg, ResMsg>;
      handler: PluginHandler<T, ReqMsg, ResMsg>;
    }
  : never;

export { type Plugin, type PluginDefinition, type PluginHandler };
