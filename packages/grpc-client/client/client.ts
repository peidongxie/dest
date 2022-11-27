import {
  credentials,
  makeGenericClientConstructor,
  type ChannelCredentials,
  type ChannelOptions,
  type ClientDuplexStream,
  type ClientReadableStream,
  type ClientUnaryCall,
  type ClientWritableStream,
  type ServiceError,
  type ServiceDefinition,
} from '@grpc/grpc-js';
import { type Reader, type Writer } from 'protobufjs/minimal';
import { type RequestWrapped } from './request';
import { type ResponseWrapped } from './response';
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

interface ClientMessage<T> {
  encode: (message: T, writer?: Writer) => Writer;
  decode: (input: Reader | Uint8Array, length?: number) => T;
  fromJSON: (object: unknown) => T;
  toJSON: (message: T) => unknown;
  fromPartial: <I extends Exact<DeepPartial<T>, I>>(object: I) => T;
}

interface ClientMethod {
  name: string;
  requestType: ClientMessage<
    Parameters<
      ServiceDefinition[keyof ServiceDefinition]['requestSerialize']
    >[0]
  >;
  requestStream: boolean;
  responseType: ClientMessage<
    ReturnType<
      ServiceDefinition[keyof ServiceDefinition]['responseDeserialize']
    >
  >;
  responseStream: boolean;
  options: Record<string, unknown>;
}

interface ClientDefinition {
  name: string;
  fullName: string;
  methods: Record<string, ClientMethod>;
}

interface ClientOptions extends ChannelOptions {
  port?: number;
  hostname?: string;
  credentials?: ChannelCredentials;
}

type ClientRaw = InstanceType<ReturnType<typeof makeGenericClientConstructor>>;

interface ClientHandlerMap<ReqMsg, ResMsg> {
  UNARY: (
    request: ReqMsg,
    callback: (error: ServiceError | null, response: ResMsg) => void,
  ) => ClientUnaryCall;
  SERVER: (request: ReqMsg) => ClientReadableStream<ResMsg>;
  CLIENT: (
    callback: (error: ServiceError | null, response: ResMsg) => void,
  ) => ClientWritableStream<ReqMsg>;
  BIDI: () => ClientDuplexStream<ReqMsg, ResMsg>;
}

type ClientHandler<T extends RpcType, ReqMsg, ResMsg> = ClientHandlerMap<
  ReqMsg,
  ResMsg
>[T];

class Client {
  private definition: ClientDefinition;
  private raw: ClientRaw;

  constructor(definition: ClientDefinition, options?: ClientOptions) {
    this.definition = definition;
    const serviceName = this.definition.fullName;
    const GenericClient = makeGenericClientConstructor(
      Object.fromEntries(
        Object.entries(this.definition.methods).map(
          ([
            methodName,
            { requestType, requestStream, responseType, responseStream },
          ]) => [
            methodName,
            {
              path: `/${serviceName}/${methodName}`,
              requestStream,
              responseStream,
              requestSerialize: (value: typeof requestType) =>
                Buffer.from(requestType.encode(value).finish()),
              requestDeserialize: (value: Buffer) => requestType.decode(value),
              responseSerialize: (value: typeof responseType) =>
                Buffer.from(responseType.encode(value).finish()),
              responseDeserialize: (value: Buffer) =>
                responseType.decode(value),
            },
          ],
        ),
      ),
      serviceName,
    );
    const hostname = options?.hostname || 'localhost';
    const port = options?.port || 50051;
    this.raw = new GenericClient(
      `${hostname}:${port}`,
      options?.credentials || credentials.createInsecure(),
      options,
    );
  }

  public call<T extends RpcType, ReqMsg, ResMsg>(
    method: string,
    req: RequestWrapped<T, ReqMsg>,
  ): Promise<ResponseWrapped<T, ResMsg>> {
    const { requestStream, responseStream } = this.definition.methods[method];
    const handler = this.getHandler<T, ReqMsg, ResMsg>(method);
    if (!handler) throw new TypeError('Invalid method');
    if (!requestStream) {
      if (!responseStream) {
        const res = new Promise<ResponseWrapped<'UNARY', ResMsg>>(
          (resolve, reject) => {
            (handler as ClientHandler<'UNARY', ReqMsg, ResMsg>)(
              req as RequestWrapped<'UNARY', ReqMsg>,
              (reason, value) => {
                if (reason) reject(reason);
                else resolve(value);
              },
            );
          },
        );
        return res as Promise<ResponseWrapped<T, ResMsg>>;
      } else {
        const res = new Promise<ResponseWrapped<'SERVER', ResMsg>>(
          (resolve) => {
            resolve(
              (handler as ClientHandler<'SERVER', ReqMsg, ResMsg>)(
                req as RequestWrapped<'SERVER', ReqMsg>,
              ),
            );
          },
        );
        return res as Promise<ResponseWrapped<T, ResMsg>>;
      }
    } else {
      if (!responseStream) {
        const res = new Promise<ResponseWrapped<'CLIENT', ResMsg>>(
          (resolve, reject) => {
            const stream = (handler as ClientHandler<'CLIENT', ReqMsg, ResMsg>)(
              (reason, value) => {
                if (reason) reject(reason);
                else resolve(value);
              },
            );
            (async () => {
              for await (const reqItem of req as RequestWrapped<
                'CLIENT',
                ReqMsg
              >) {
                stream.write(reqItem);
              }
              stream.end();
            })();
          },
        );
        return res as Promise<ResponseWrapped<T, ResMsg>>;
      } else {
        const res = new Promise<ResponseWrapped<'BIDI', ResMsg>>((resolve) => {
          const stream = (handler as ClientHandler<'BIDI', ReqMsg, ResMsg>)();
          (async () => {
            for await (const reqItem of req as RequestWrapped<'BIDI', ReqMsg>) {
              stream.write(reqItem);
            }
            stream.end();
          })();
          resolve(stream);
        });
        return res as Promise<ResponseWrapped<T, ResMsg>>;
      }
    }
  }

  private getHandler<T extends RpcType, ReqMsg, ResMsg>(
    method: string,
  ): ClientHandler<T, ReqMsg, ResMsg> | null {
    const handler = this.raw[method];
    if (!handler) return null;
    return handler.bind(this.raw);
  }
}

export { Client as default, type ClientDefinition, type ClientOptions };
