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

class Response<T extends RpcType, ResMsg> {
  private originalValue: ServerResponse<T, ResMsg>;
  private type: PluginType<T>;

  constructor(type: PluginType<T>, res: ServerResponse<T, ResMsg>) {
    this.originalValue = res;
    this.type = type;
  }

  async setResponse(res: PluginResponse<T, ResMsg>): Promise<void> {
    switch (this.type) {
      case 'unary': {
        const serverResponse = this.originalValue as ServerResponse<
          'UNARY',
          ResMsg
        >;
        const handlerResponse = res as PluginResponse<'UNARY', ResMsg>;
        if (!(handlerResponse instanceof Error)) {
          serverResponse[1](null, handlerResponse);
        } else {
          serverResponse[1](handlerResponse);
        }
        break;
      }
      case 'server-streaming': {
        const serverResponse = this.originalValue as ServerResponse<
          'SERVER',
          ResMsg
        >;
        const handlerResponse = res as PluginResponse<'SERVER', ResMsg>;
        if (!(handlerResponse instanceof Error)) {
          for await (const resMsg of handlerResponse) {
            serverResponse[0].write(resMsg);
          }
        }
        break;
      }
      case 'client-streaming': {
        const serverResponse = this.originalValue as ServerResponse<
          'CLIENT',
          ResMsg
        >;
        const handlerResponse = res as PluginResponse<'CLIENT', ResMsg>;
        if (!(handlerResponse instanceof Error)) {
          serverResponse[1](null, handlerResponse);
        } else {
          serverResponse[1](handlerResponse);
        }
        break;
      }
      case 'bidi-streaming': {
        const serverResponse = this.originalValue as ServerResponse<
          'BIDI',
          ResMsg
        >;
        const handlerResponse = res as PluginResponse<'BIDI', ResMsg>;
        if (!(handlerResponse instanceof Error)) {
          for await (const resMsg of handlerResponse) {
            serverResponse[0].write(resMsg);
          }
        }
        break;
      }
      default:
        throw new TypeError('Bad RPC type');
    }
  }
}

export { Response as default, type PluginResponse, type ServerResponse };
