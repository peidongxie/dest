import { type ServiceDefinition } from '@grpc/grpc-js';
import { type Reader, type Writer } from 'protobufjs/minimal';

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

type ValuesOfUnion<T, K extends KeysOfUnion<T>> = K extends K
  ? T extends Record<K, unknown>
    ? T[K]
    : never
  : never;

type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

interface ProtoMessage<T> {
  encode: (message: T, writer?: Writer) => Writer;
  decode: (input: Reader | Uint8Array, length?: number) => T;
  fromJSON: (object: unknown) => T;
  toJSON: (message: T) => unknown;
  fromPartial: <I extends Exact<DeepPartial<T>, I>>(object: I) => T;
}

interface ProtoMethod {
  name: string;
  requestType: ProtoMessage<
    Parameters<
      ServiceDefinition[keyof ServiceDefinition]['requestSerialize']
    >[0]
  >;
  requestStream: boolean;
  responseType: ProtoMessage<
    ReturnType<
      ServiceDefinition[keyof ServiceDefinition]['responseDeserialize']
    >
  >;
  responseStream: boolean;
  options: Record<string, unknown>;
}

interface ProtoDefinition {
  name: string;
  fullName: string;
  methods: Record<string, ProtoMethod>;
}

type ReqMsg<Method extends ProtoMethod> = Method extends {
  requestType: ProtoMessage<infer ReqMsg>;
}
  ? ReqMsg
  : never;

type ResMsg<Method extends ProtoMethod> = Method extends {
  responseType: ProtoMessage<infer ResMsg>;
}
  ? ResMsg
  : never;

type RpcType<Method extends ProtoMethod> = Method extends {
  requestStream: false;
  responseStream: false;
}
  ? 'UNARY'
  : Method extends {
      requestStream: false;
      responseStream: true;
    }
  ? 'SERVER'
  : Method extends {
      requestStream: true;
      responseStream: false;
    }
  ? 'CLIENT'
  : Method extends {
      requestStream: true;
      responseStream: true;
    }
  ? 'BIDI'
  : never;

export {
  type KeysOfUnion,
  type ProtoDefinition,
  type ProtoMethod,
  type ReqMsg,
  type ResMsg,
  type RpcType,
  type ValuesOfUnion,
};
