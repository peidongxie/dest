import {
  type ServiceDefinition,
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type handleUnaryCall,
} from '@grpc/grpc-js';
import { type ProtoMethod, type ResMsg, type RpcType } from './type';

interface ResponseRawMap<ResMsg> {
  UNARY: Parameters<
    handleUnaryCall<
      ReturnType<
        ServiceDefinition[keyof ServiceDefinition]['requestDeserialize']
      >,
      ResMsg
    >
  >;
  SERVER: Parameters<
    handleServerStreamingCall<
      ReturnType<
        ServiceDefinition[keyof ServiceDefinition]['requestDeserialize']
      >,
      ResMsg
    >
  >;
  CLIENT: Parameters<
    handleClientStreamingCall<
      ReturnType<
        ServiceDefinition[keyof ServiceDefinition]['requestDeserialize']
      >,
      ResMsg
    >
  >;
  BIDI: Parameters<
    handleBidiStreamingCall<
      ReturnType<
        ServiceDefinition[keyof ServiceDefinition]['requestDeserialize']
      >,
      ResMsg
    >
  >;
}

type ResponseRaw<
  Method extends ProtoMethod,
  T extends 'UNARY' | 'SERVER' | 'CLIENT' | 'BIDI' = RpcType<Method>,
> = ResponseRawMap<ResMsg<Method>>[T];

interface ResponseWrappedMap<ResMsg> {
  UNARY: Error | ResMsg;
  SERVER: Error | Iterable<ResMsg> | AsyncIterable<ResMsg>;
  CLIENT: Error | ResMsg;
  BIDI: Error | Iterable<ResMsg> | AsyncIterable<ResMsg>;
}

type ResponseWrapped<
  Method extends ProtoMethod,
  T extends 'UNARY' | 'SERVER' | 'CLIENT' | 'BIDI' = RpcType<Method>,
> = ResponseWrappedMap<ResMsg<Method>>[T];

class Response<Method extends ProtoMethod> {
  private raw: ResponseRaw<Method>;
  private stream: Method['responseStream'];

  constructor(stream: Method['responseStream'], res: ResponseRaw<Method>) {
    this.raw = res;
    this.stream = stream;
  }

  public async setResponse(res: ResponseWrapped<Method>): Promise<void> {
    if (!this.stream) {
      const raw = this.raw as
        | ResponseRaw<Method, 'UNARY'>
        | ResponseRaw<Method, 'CLIENT'>;
      const wrapped = res as
        | ResponseWrapped<Method, 'UNARY'>
        | ResponseWrapped<Method, 'CLIENT'>;
      if (!(wrapped instanceof Error)) {
        raw[1](null, wrapped);
      } else {
        raw[1](wrapped);
      }
    } else {
      const raw = this.raw as
        | ResponseRaw<Method, 'SERVER'>
        | ResponseRaw<Method, 'BIDI'>;
      const wrapped = res as
        | ResponseWrapped<Method, 'SERVER'>
        | ResponseWrapped<Method, 'BIDI'>;
      if (!(wrapped instanceof Error)) {
        for await (const resMsg of wrapped) {
          raw[0].write(resMsg);
        }
      }
    }
  }
}

export { Response as default, type ResponseRaw, type ResponseWrapped };
