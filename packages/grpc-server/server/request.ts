import { type HandlerRequest } from './handler';
import { type RpcType, type ServerRequest } from './server';

class Request<T extends RpcType, ReqMsg> {
  private originalValue: ServerRequest<T, ReqMsg>;
  private type: T;

  constructor(type: T, req: ServerRequest<T, ReqMsg>) {
    this.originalValue = req;
    this.type = type;
  }

  getRequest(): HandlerRequest<T, ReqMsg> {
    switch (this.type) {
      case 'Unary': {
        const serverRequest = this.originalValue as ServerRequest<
          'Unary',
          ReqMsg
        >;
        const handlerRequest: HandlerRequest<'Unary', ReqMsg> =
          serverRequest[0].request;
        return handlerRequest as HandlerRequest<T, ReqMsg>;
      }
      case 'ServerStreaming': {
        const serverRequest = this.originalValue as ServerRequest<
          'ServerStreaming',
          ReqMsg
        >;
        const handlerRequest: HandlerRequest<'ServerStreaming', ReqMsg> =
          serverRequest[0].request;
        return handlerRequest as HandlerRequest<T, ReqMsg>;
      }
      case 'ClientStreaming': {
        const serverRequest = this.originalValue as ServerRequest<
          'ClientStreaming',
          ReqMsg
        >;
        const handlerRequest: HandlerRequest<'ClientStreaming', ReqMsg> =
          (async function* () {
            for await (const reqMsg of serverRequest[0]) {
              yield reqMsg;
            }
          })();
        return handlerRequest as HandlerRequest<T, ReqMsg>;
      }
      case 'BidiStreaming': {
        const serverRequest = this.originalValue as ServerRequest<
          'BidiStreaming',
          ReqMsg
        >;
        const handlerRequest: HandlerRequest<'BidiStreaming', ReqMsg> =
          (async function* () {
            for await (const reqMsg of serverRequest[0]) {
              yield reqMsg;
            }
          })();
        return handlerRequest as HandlerRequest<T, ReqMsg>;
      }
      default:
        throw new TypeError('Bad RPC type');
    }
  }
}

export { Request as default };
