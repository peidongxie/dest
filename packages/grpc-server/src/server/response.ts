import { type HandlerResponse } from './handler';
import { type RpcType, type ServerResponse } from './server';

class Response<T extends RpcType, ResMsg> {
  private originalValue: ServerResponse<T, ResMsg>;
  private type: T;

  constructor(type: T, res: ServerResponse<T, ResMsg>) {
    this.originalValue = res;
    this.type = type;
  }

  async setResponse(res: HandlerResponse<T, ResMsg>): Promise<void> {
    switch (this.type) {
      case 'Unary': {
        const serverResponse = this.originalValue as ServerResponse<
          'Unary',
          ResMsg
        >;
        const handlerResponse = res as HandlerResponse<'Unary', ResMsg>;
        if (!(handlerResponse instanceof Error)) {
          serverResponse[1](null, handlerResponse);
        } else {
          serverResponse[1](handlerResponse);
        }
        break;
      }
      case 'ServerStreaming': {
        const serverResponse = this.originalValue as ServerResponse<
          'ServerStreaming',
          ResMsg
        >;
        const handlerResponse = res as HandlerResponse<
          'ServerStreaming',
          ResMsg
        >;
        if (!(handlerResponse instanceof Error)) {
          for await (const resMsg of handlerResponse) {
            serverResponse[0].write(resMsg);
          }
        }
        break;
      }
      case 'ClientStreaming': {
        const serverResponse = this.originalValue as ServerResponse<
          'ClientStreaming',
          ResMsg
        >;
        const handlerResponse = res as HandlerResponse<
          'ClientStreaming',
          ResMsg
        >;
        if (!(handlerResponse instanceof Error)) {
          serverResponse[1](null, handlerResponse);
        } else {
          serverResponse[1](handlerResponse);
        }
        break;
      }
      case 'BidiStreaming': {
        const serverResponse = this.originalValue as ServerResponse<
          'BidiStreaming',
          ResMsg
        >;
        const handlerResponse = res as HandlerResponse<'BidiStreaming', ResMsg>;
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

export { Response as default };
