import {
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type handleUnaryCall,
} from '@grpc/grpc-js';
import { type PluginType } from './plugin';
import { type RpcType } from './type';

interface ServerResponseMap<ResMsg> {
  UNARY: Parameters<handleUnaryCall<unknown, ResMsg>>;
  SERVER: Parameters<handleServerStreamingCall<unknown, ResMsg>>;
  CLIENT: Parameters<handleClientStreamingCall<unknown, ResMsg>>;
  BIDI: Parameters<handleBidiStreamingCall<unknown, ResMsg>>;
}

type ServerResponse<T extends RpcType, ResMsg> = ServerResponseMap<ResMsg>[T];

interface PluginResponseMap<ResMsg> {
  UNARY: Error | ResMsg;
  SERVER: Error | Iterable<ResMsg> | AsyncIterable<ResMsg>;
  CLIENT: Error | ResMsg;
  BIDI: Error | Iterable<ResMsg> | AsyncIterable<ResMsg>;
}

type PluginResponse<T extends RpcType, ResMsg> = PluginResponseMap<ResMsg>[T];

type StrategyMap = {
  [T in RpcType as PluginType<T>]: <ResMsg>(
    serverRequest: ServerResponse<T, ResMsg>,
    pluginResponse: PluginResponse<T, ResMsg>,
  ) => Promise<void>;
};

const strategyMap: StrategyMap = {
  unary: async (serverResponse, pluginResponse) => {
    if (!(pluginResponse instanceof Error)) {
      serverResponse[1](null, pluginResponse);
    } else {
      serverResponse[1](pluginResponse);
    }
  },
  ['server-streaming']: async (serverResponse, pluginResponse) => {
    if (!(pluginResponse instanceof Error)) {
      for await (const resMsg of pluginResponse) {
        serverResponse[0].write(resMsg);
      }
    }
  },
  ['client-streaming']: async (serverResponse, pluginResponse) => {
    if (!(pluginResponse instanceof Error)) {
      serverResponse[1](null, pluginResponse);
    } else {
      serverResponse[1](pluginResponse);
    }
  },
  ['bidi-streaming']: async (serverResponse, pluginResponse) => {
    if (!(pluginResponse instanceof Error)) {
      for await (const resMsg of pluginResponse) {
        serverResponse[0].write(resMsg);
      }
    }
  },
};

class Response<T extends RpcType, ResMsg> {
  private originalValue: ServerResponse<T, ResMsg>;
  private type: PluginType<T>;

  constructor(type: PluginType<T>, res: ServerResponse<T, ResMsg>) {
    this.originalValue = res;
    this.type = type;
  }

  async setResponse(res: PluginResponse<T, ResMsg>): Promise<void> {
    const strategy = strategyMap[this.type] as <ResMsg>(
      serverRequest: ServerResponse<T, ResMsg>,
      pluginResponse: PluginResponse<T, ResMsg>,
    ) => Promise<void>;
    await strategy(this.originalValue, res);
  }
}

export { Response as default, type PluginResponse, type ServerResponse };
