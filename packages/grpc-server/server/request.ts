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

type StrategyMap = {
  [T in RpcType as PluginType<T>]: <ReqMsg>(
    serverRequest: ServerRequest<T, ReqMsg>,
  ) => PluginRequest<T, ReqMsg>;
};

const strategyMap: StrategyMap = {
  unary: (serverRequest) => {
    const pluginRequest = serverRequest[0].request;
    return pluginRequest;
  },
  ['server-streaming']: (serverRequest) => {
    const pluginRequest = serverRequest[0].request;
    return pluginRequest;
  },
  ['client-streaming']: (serverRequest) => {
    const pluginRequest = (async function* () {
      for await (const reqMsg of serverRequest[0]) {
        yield reqMsg;
      }
    })();
    return pluginRequest;
  },
  ['bidi-streaming']: (serverRequest) => {
    const pluginRequest = (async function* () {
      for await (const reqMsg of serverRequest[0]) {
        yield reqMsg;
      }
    })();
    return pluginRequest;
  },
};

class Request<T extends RpcType, ReqMsg> {
  originalValue: ServerRequest<T, ReqMsg>;
  type: PluginType<T>;

  constructor(type: PluginType<T>, req: ServerRequest<T, ReqMsg>) {
    this.originalValue = req;
    this.type = type;
  }

  getRequest(): PluginRequest<T, ReqMsg> {
    const strategy = strategyMap[this.type] as <ReqMsg>(
      serverRequest: ServerRequest<T, ReqMsg>,
    ) => PluginRequest<T, ReqMsg>;
    return strategy(this.originalValue);
  }
}

export { Request as default, type PluginRequest, type ServerRequest };
