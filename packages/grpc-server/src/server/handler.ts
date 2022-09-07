import { type MethodDefinition } from '@grpc/grpc-js';
import { type RpcType } from './server';

type Definition<T extends RpcType, ReqMsg, ResMsg> = MethodDefinition<
  ReqMsg,
  ResMsg
> & {
  requestStream?: T extends 'Unary'
    ? false
    : T extends 'ServerStreaming'
    ? false
    : T extends 'ClientStreaming'
    ? true
    : T extends 'BidiStreaming'
    ? true
    : never;
  responseStream?: T extends 'Unary'
    ? false
    : T extends 'ServerStreaming'
    ? true
    : T extends 'ClientStreaming'
    ? false
    : T extends 'BidiStreaming'
    ? true
    : never;
};

type HandlerRequest<T extends RpcType, ReqMsg> = T extends 'Unary'
  ? ReqMsg
  : T extends 'ServerStreaming'
  ? ReqMsg
  : T extends 'ClientStreaming'
  ? Iterable<ReqMsg> | AsyncIterable<ReqMsg>
  : T extends 'BidiStreaming'
  ? Iterable<ReqMsg> | AsyncIterable<ReqMsg>
  : never;

type HandlerResponse<T extends RpcType, ResMsg> = T extends 'Unary'
  ? ResMsg | Error
  : T extends 'ServerStreaming'
  ? Iterable<ResMsg> | AsyncIterable<ResMsg> | Error
  : T extends 'ClientStreaming'
  ? ResMsg | Error
  : T extends 'BidiStreaming'
  ? Iterable<ResMsg> | AsyncIterable<ResMsg> | Error
  : never;

type Handler<T extends RpcType, ReqMsg, ResMsg> = (
  req: HandlerRequest<T, ReqMsg>,
) => HandlerResponse<T, ResMsg> | Promise<HandlerResponse<T, ResMsg>>;

interface Plugin<T extends RpcType, ReqMsg, ResMsg> {
  type: T;
  definition: Definition<T, ReqMsg, ResMsg>;
  handler: Handler<T, ReqMsg, ResMsg>;
}

export {
  type Definition,
  type Handler,
  type HandlerRequest,
  type HandlerResponse,
  type Plugin,
};
