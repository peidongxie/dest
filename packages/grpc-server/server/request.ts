import {
  type ServiceDefinition,
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type handleUnaryCall,
} from '@grpc/grpc-js';
import { type ProtoMethod, type ReqMsg, type RpcType } from './type';

interface RequestRawMap<ReqMsg> {
  UNARY: Parameters<
    handleUnaryCall<
      ReqMsg,
      Parameters<
        ServiceDefinition[keyof ServiceDefinition]['responseSerialize']
      >[0]
    >
  >;
  SERVER: Parameters<
    handleServerStreamingCall<
      ReqMsg,
      Parameters<
        ServiceDefinition[keyof ServiceDefinition]['responseSerialize']
      >[0]
    >
  >;
  CLIENT: Parameters<
    handleClientStreamingCall<
      ReqMsg,
      Parameters<
        ServiceDefinition[keyof ServiceDefinition]['responseSerialize']
      >[0]
    >
  >;
  BIDI: Parameters<
    handleBidiStreamingCall<
      ReqMsg,
      Parameters<
        ServiceDefinition[keyof ServiceDefinition]['responseSerialize']
      >[0]
    >
  >;
}

type RequestRaw<
  Method extends ProtoMethod,
  T extends 'UNARY' | 'SERVER' | 'CLIENT' | 'BIDI' = RpcType<Method>,
> = RequestRawMap<ReqMsg<Method>>[T];

interface RequestWrappedMap<ReqMsg> {
  UNARY: ReqMsg;
  SERVER: ReqMsg;
  CLIENT: AsyncIterable<ReqMsg>;
  BIDI: AsyncIterable<ReqMsg>;
}

type RequestWrapped<
  Method extends ProtoMethod,
  T extends 'UNARY' | 'SERVER' | 'CLIENT' | 'BIDI' = RpcType<Method>,
> = RequestWrappedMap<ReqMsg<Method>>[T];

class Request<Method extends ProtoMethod> {
  private raw: RequestRaw<Method>;
  private stream: Method['requestStream'];

  constructor(stream: Method['requestStream'], req: RequestRaw<Method>) {
    this.raw = req;
    this.stream = stream;
  }

  public getRequest(): RequestWrapped<Method> {
    if (!this.stream) {
      const raw = this.raw as
        | RequestRaw<Method, 'UNARY'>
        | RequestRaw<Method, 'SERVER'>;
      const wrapped:
        | RequestWrapped<Method, 'UNARY'>
        | RequestWrapped<Method, 'SERVER'> = raw[0].request;
      return wrapped as RequestWrapped<Method>;
    } else {
      const raw = this.raw as
        | RequestRaw<Method, 'CLIENT'>
        | RequestRaw<Method, 'BIDI'>;
      const wrapped:
        | RequestWrapped<Method, 'CLIENT'>
        | RequestWrapped<Method, 'BIDI'> = (async function* () {
        for await (const reqMsg of raw[0]) {
          yield reqMsg;
        }
      })();
      return wrapped as RequestWrapped<Method>;
    }
  }
}

export { Request as default, type RequestRaw, type RequestWrapped };
