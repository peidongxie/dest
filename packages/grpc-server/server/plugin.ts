import { type Reader, type Writer } from 'protobufjs/minimal';
import { type RequestStream, type RequestWrapped } from './request';
import { type ResponseStream, type ResponseWrapped } from './response';
import { type RpcType } from './type';

type Builtin =
  | Date
  | ((...args: never[]) => void)
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends Record<string, unknown>
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;

type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

interface PluginMessage<T> {
  encode: (message: T, writer?: Writer) => Writer;
  decode: (input: Reader | Uint8Array, length?: number) => T;
  fromJSON: (object: unknown) => T;
  toJSON: (message: T) => unknown;
  fromPartial: <I extends Exact<DeepPartial<T>, I>>(object: I) => T;
}

type PluginHandler<T extends RpcType, ReqMsg, ResMsg> = T extends RpcType
  ? (
      req: RequestWrapped<T, ReqMsg>,
    ) => ResponseWrapped<T, ResMsg> | Promise<ResponseWrapped<T, ResMsg>>
  : never;

type PluginMethod<T extends RpcType, ReqMsg, ResMsg> = T extends RpcType
  ? {
      name: string;
      requestType: PluginMessage<ReqMsg>;
      requestStream: RequestStream<T>;
      responseType: PluginMessage<ResMsg>;
      responseStream: ResponseStream<T>;
      options: Record<string, unknown>;
      handler: PluginHandler<T, ReqMsg, ResMsg>;
    }
  : never;

type Plugin<T extends RpcType, ReqMsg, ResMsg> = T extends RpcType
  ? {
      service: string;
      method: PluginMethod<T, ReqMsg, ResMsg>;
    }
  : never;

export { type Plugin, type PluginHandler, type PluginMethod };
