import {
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type handleUnaryCall,
} from '@grpc/grpc-js';
import { type PluginDefinition } from './plugin';
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
  private stream: PluginDefinition<T, ReqMsg, unknown>['requestStream'];

  constructor(
    stream: PluginDefinition<T, ReqMsg, unknown>['requestStream'],
    req: ServerRequest<T, ReqMsg>,
  ) {
    this.originalValue = req;
    this.stream = stream;
  }

  public getRequest(): PluginRequest<T, ReqMsg> {
    if (!this.stream) {
      const serverRequest = this.originalValue as
        | ServerRequest<'UNARY', ReqMsg>
        | ServerRequest<'SERVER', ReqMsg>;
      const pluginRequest:
        | PluginRequest<'UNARY', ReqMsg>
        | PluginRequest<'SERVER', ReqMsg> = serverRequest[0].request;
      return pluginRequest as PluginRequest<T, ReqMsg>;
    } else {
      const serverRequest = this.originalValue as
        | ServerRequest<'CLIENT', ReqMsg>
        | ServerRequest<'BIDI', ReqMsg>;
      const pluginRequest:
        | PluginRequest<'CLIENT', ReqMsg>
        | PluginRequest<'BIDI', ReqMsg> = (async function* () {
        for await (const reqMsg of serverRequest[0]) {
          yield reqMsg as ReqMsg;
        }
      })();
      return pluginRequest as PluginRequest<T, ReqMsg>;
    }
  }
}

export { Request as default, type PluginRequest, type ServerRequest };
