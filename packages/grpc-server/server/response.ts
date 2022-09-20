import {
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type handleUnaryCall,
} from '@grpc/grpc-js';
import { type PluginDefinition } from './plugin';
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

class Response<T extends RpcType, ResMsg> {
  private originalValue: ServerResponse<T, ResMsg>;
  private stream: PluginDefinition<T, unknown, ResMsg>['responseStream'];

  constructor(
    stream: PluginDefinition<T, unknown, ResMsg>['responseStream'],
    res: ServerResponse<T, ResMsg>,
  ) {
    this.originalValue = res;
    this.stream = stream;
  }

  public async setResponse(res: PluginResponse<T, ResMsg>): Promise<void> {
    if (!this.stream) {
      const serverResponse = this.originalValue as
        | ServerResponse<'UNARY', ResMsg>
        | ServerResponse<'CLIENT', ResMsg>;
      const pluginResponse = res as
        | PluginResponse<'UNARY', ResMsg>
        | PluginResponse<'CLIENT', ResMsg>;
      if (!(pluginResponse instanceof Error)) {
        serverResponse[1](null, pluginResponse);
      } else {
        serverResponse[1](pluginResponse);
      }
    } else {
      const serverResponse = this.originalValue as
        | ServerResponse<'SERVER', ResMsg>
        | ServerResponse<'BIDI', ResMsg>;
      const pluginResponse = res as
        | PluginResponse<'SERVER', ResMsg>
        | PluginResponse<'BIDI', ResMsg>;
      if (!(pluginResponse instanceof Error)) {
        for await (const resMsg of pluginResponse) {
          serverResponse[0].write(resMsg);
        }
      }
    }
  }
}

export { Response as default, type PluginResponse, type ServerResponse };
