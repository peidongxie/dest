import {
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type handleUnaryCall,
} from '@grpc/grpc-js';
import { type RpcType } from './type';

interface RequestStreamMap {
  UNARY: false;
  SERVER: false;
  CLIENT: true;
  BIDI: true;
}

type RequestStream<T extends RpcType> = RequestStreamMap[T];

interface RequestRawMap<ReqMsg> {
  UNARY: Parameters<handleUnaryCall<ReqMsg, unknown>>;
  SERVER: Parameters<handleServerStreamingCall<ReqMsg, unknown>>;
  CLIENT: Parameters<handleClientStreamingCall<ReqMsg, unknown>>;
  BIDI: Parameters<handleBidiStreamingCall<ReqMsg, unknown>>;
}

type RequestRaw<T extends RpcType, ReqMsg> = RequestRawMap<ReqMsg>[T];

interface RequestWrappedMap<ReqMsg> {
  UNARY: ReqMsg;
  SERVER: ReqMsg;
  CLIENT: AsyncIterable<ReqMsg>;
  BIDI: AsyncIterable<ReqMsg>;
}

type RequestWrapped<T extends RpcType, ReqMsg> = RequestWrappedMap<ReqMsg>[T];

class Request<T extends RpcType, ReqMsg> {
  private raw: RequestRaw<T, ReqMsg>;
  private stream: RequestStream<T>;

  constructor(stream: RequestStream<T>, req: RequestRaw<T, ReqMsg>) {
    this.raw = req;
    this.stream = stream;
  }

  public getRequest(): RequestWrapped<T, ReqMsg> {
    if (!this.stream) {
      const raw = this.raw as
        | RequestRaw<'UNARY', ReqMsg>
        | RequestRaw<'SERVER', ReqMsg>;
      const wrapped:
        | RequestWrapped<'UNARY', ReqMsg>
        | RequestWrapped<'SERVER', ReqMsg> = raw[0].request;
      return wrapped as RequestWrapped<T, ReqMsg>;
    } else {
      const raw = this.raw as
        | RequestRaw<'CLIENT', ReqMsg>
        | RequestRaw<'BIDI', ReqMsg>;
      const wrapped:
        | RequestWrapped<'CLIENT', ReqMsg>
        | RequestWrapped<'BIDI', ReqMsg> = (async function* () {
        for await (const reqMsg of raw[0]) {
          yield reqMsg as ReqMsg;
        }
      })();
      return wrapped as RequestWrapped<T, ReqMsg>;
    }
  }
}

export {
  Request as default,
  type RequestRaw,
  type RequestStream,
  type RequestWrapped,
};
