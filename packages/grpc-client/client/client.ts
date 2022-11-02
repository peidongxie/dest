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
import { type RequestWrapped } from './request';
import { type ResponseWrapped } from './response';
import { type RpcType } from './type';

type ClientDefinition = ServiceDefinition[keyof ServiceDefinition];

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
  private definitions: Record<string, ClientDefinition>;
  private raw: ClientRaw;

  constructor(
    definitions: ClientDefinition[] | Record<string, ClientDefinition>,
    options: ClientOptions,
  ) {
    this.definitions = Array.isArray(definitions)
      ? Object.fromEntries(
          definitions.map((definition) => [definition.path, definition]),
        )
      : Object.fromEntries(
          Object.entries(definitions).map((entry) => [entry[1].path, entry[1]]),
        );
    const GenericClient = makeGenericClientConstructor(this.definitions, '');
    const hostname = options?.hostname || 'localhost';
    const port = options?.port || 50051;
    this.raw = new GenericClient(
      `${hostname}:${port}`,
      options.credentials || credentials.createInsecure(),
      options,
    );
  }

  public call<T extends RpcType, ReqMsg, ResMsg>(
    path: string,
    req: RequestWrapped<T, ReqMsg>,
  ): Promise<ResponseWrapped<T, ResMsg>> {
    const { requestStream, responseStream } = this.definitions[path];
    const handler = this.getHandler<T, ReqMsg, ResMsg>(path);
    if (!handler) throw new TypeError('Invalid path');
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
    path: string,
  ): ClientHandler<T, ReqMsg, ResMsg> | null {
    const handler = this.raw[path];
    if (!handler) return null;
    return handler.bind(this.raw);
  }
}

export { Client as default, type ClientDefinition, type ClientOptions };
