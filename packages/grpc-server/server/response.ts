import {
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type handleUnaryCall,
} from '@grpc/grpc-js';
import { type RpcType } from './type';

interface ResponseStreamMap {
  UNARY: false;
  SERVER: true;
  CLIENT: false;
  BIDI: true;
}

type ResponseStream<T extends RpcType> = ResponseStreamMap[T];

interface ResponseRawMap<ResMsg> {
  UNARY: Parameters<handleUnaryCall<unknown, ResMsg>>;
  SERVER: Parameters<handleServerStreamingCall<unknown, ResMsg>>;
  CLIENT: Parameters<handleClientStreamingCall<unknown, ResMsg>>;
  BIDI: Parameters<handleBidiStreamingCall<unknown, ResMsg>>;
}

type ResponseRaw<T extends RpcType, ResMsg> = ResponseRawMap<ResMsg>[T];

interface ResponseWrappedMap<ResMsg> {
  UNARY: Error | ResMsg;
  SERVER: Error | Iterable<ResMsg> | AsyncIterable<ResMsg>;
  CLIENT: Error | ResMsg;
  BIDI: Error | Iterable<ResMsg> | AsyncIterable<ResMsg>;
}

type ResponseWrapped<T extends RpcType, ResMsg> = ResponseWrappedMap<ResMsg>[T];

class Response<T extends RpcType, ResMsg> {
  private raw: ResponseRaw<T, ResMsg>;
  private stream: ResponseStream<T>;

  constructor(stream: ResponseStream<T>, res: ResponseRaw<T, ResMsg>) {
    this.raw = res;
    this.stream = stream;
  }

  public async setResponse(res: ResponseWrapped<T, ResMsg>): Promise<void> {
    if (!this.stream) {
      const raw = this.raw as
        | ResponseRaw<'UNARY', ResMsg>
        | ResponseRaw<'CLIENT', ResMsg>;
      const wrapped = res as
        | ResponseWrapped<'UNARY', ResMsg>
        | ResponseWrapped<'CLIENT', ResMsg>;
      if (!(wrapped instanceof Error)) {
        raw[1](null, wrapped);
      } else {
        raw[1](wrapped);
      }
    } else {
      const raw = this.raw as
        | ResponseRaw<'SERVER', ResMsg>
        | ResponseRaw<'BIDI', ResMsg>;
      const wrapped = res as
        | ResponseWrapped<'SERVER', ResMsg>
        | ResponseWrapped<'BIDI', ResMsg>;
      if (!(wrapped instanceof Error)) {
        for await (const resMsg of wrapped) {
          raw[0].write(resMsg);
        }
      }
    }
  }
}

export {
  Response as default,
  type ResponseRaw,
  type ResponseStream,
  type ResponseWrapped,
};
