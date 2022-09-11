import {
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type handleUnaryCall,
} from '@grpc/grpc-js';
import { type PluginType } from './plugin';
import { type RpcType } from './type';

interface ServerRequestMap<ReqMsg> {
  UNARY: Parameters<handleUnaryCall<ReqMsg, unknown>>;
  SERVER: Parameters<handleServerStreamingCall<ReqMsg, unknown>>;
  CLIENT: Parameters<handleClientStreamingCall<ReqMsg, unknown>>;
  BIDI: Parameters<handleBidiStreamingCall<ReqMsg, unknown>>;
}

type ServerRequest<T extends RpcType, ReqMsg> = ServerRequestMap<ReqMsg>[T];

interface PluginRequestMap<ReqMsg> {
  UNARY: ReqMsg;
  SERVER: ReqMsg;
  CLIENT: Iterable<ReqMsg> | AsyncIterable<ReqMsg>;
  BIDI: Iterable<ReqMsg> | AsyncIterable<ReqMsg>;
}

type PluginRequest<T extends RpcType, ReqMsg> = PluginRequestMap<ReqMsg>[T];

class Request<T extends RpcType, ReqMsg> {
  private originalValue: ServerRequest<T, ReqMsg>;
  private type: PluginType<T>;

  constructor(type: PluginType<T>, req: ServerRequest<T, ReqMsg>) {
    this.originalValue = req;
    this.type = type;
  }

  getRequest(): PluginRequest<T, ReqMsg> {
    switch (this.type) {
      case 'unary': {
        const serverRequest = this.originalValue as ServerRequest<
          'UNARY',
          ReqMsg
        >;
        const handlerRequest: PluginRequest<'UNARY', ReqMsg> =
          serverRequest[0].request;
        return handlerRequest as PluginRequest<T, ReqMsg>;
      }
      case 'server-streaming': {
        const serverRequest = this.originalValue as ServerRequest<
          'SERVER',
          ReqMsg
        >;
        const handlerRequest: PluginRequest<'SERVER', ReqMsg> =
          serverRequest[0].request;
        return handlerRequest as PluginRequest<T, ReqMsg>;
      }
      case 'client-streaming': {
        const serverRequest = this.originalValue as ServerRequest<
          'CLIENT',
          ReqMsg
        >;
        const handlerRequest: PluginRequest<'CLIENT', ReqMsg> =
          (async function* () {
            for await (const reqMsg of serverRequest[0]) {
              yield reqMsg;
            }
          })();
        return handlerRequest as PluginRequest<T, ReqMsg>;
      }
      case 'bidi-streaming': {
        const serverRequest = this.originalValue as ServerRequest<
          'BIDI',
          ReqMsg
        >;
        const handlerRequest: PluginRequest<'BIDI', ReqMsg> =
          (async function* () {
            for await (const reqMsg of serverRequest[0]) {
              yield reqMsg;
            }
          })();
        return handlerRequest as PluginRequest<T, ReqMsg>;
      }
      default:
        throw new TypeError('Bad RPC type');
    }
  }
}

export { Request as default, type PluginRequest, type ServerRequest };
