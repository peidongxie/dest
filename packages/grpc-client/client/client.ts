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
} from '@grpc/grpc-js';
import { type RequestWrapped } from './request';
import { type ResponseWrapped } from './response';
import {
  type KeysOfUnion,
  type ProtoDefinition,
  type ProtoMethod,
  type ReqMsg,
  type ResMsg,
  type RpcType,
} from './type';
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

type ClientHandler<
  Method extends ProtoMethod,
  T extends 'UNARY' | 'SERVER' | 'CLIENT' | 'BIDI' = RpcType<Method>,
> = ClientHandlerMap<ReqMsg<Method>, ResMsg<Method>>[T];

class Client<Definition extends ProtoDefinition> {
  private calls: Map<string, { service: string; method: ProtoMethod }>;
  private raw: ClientRaw;

  constructor(definitions: Definition[], options?: ClientOptions) {
    this.calls = new Map(
      definitions
        .map((definition) =>
          Object.entries(definition.methods).map(
            ([callName, method]) =>
              [
                callName,
                {
                  service: definition.fullName,
                  method,
                },
              ] as const,
          ),
        )
        .flat(),
    );
    const GenericClient = makeGenericClientConstructor(
      Object.fromEntries(
        Array.from(this.calls).map(
          ([
            callName,
            {
              service: serviceName,
              method: {
                name: methodName,
                requestType,
                requestStream,
                responseType,
                responseStream,
              },
            },
          ]) => [
            callName,
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
      definitions.map((definition) => definition.name).join(),
    );
    const hostname = options?.hostname || 'localhost';
    const port = options?.port || 50051;
    this.raw = new GenericClient(
      `${hostname}:${port}`,
      options?.credentials || credentials.createInsecure(),
      options,
    );
  }

  public call<CallName extends KeysOfUnion<Definition['methods']>>(
    method: CallName,
  ): (
    req: RequestWrapped<Definition['methods'][CallName]>,
  ) => Promise<ResponseWrapped<Definition['methods'][CallName]>> {
    const callName = method;
    if (this.calls.has(callName)) {
      const call = this.calls.get(callName);
      const requestStream = call?.method.requestStream;
      const responseStream = call?.method.responseStream;
      const handler: ClientHandler<Definition['methods'][CallName]> = this.raw[
        callName
      ].bind(this.raw);
      if (!requestStream && !responseStream) {
        return (req: RequestWrapped<Definition['methods'][CallName]>) => {
          const res = new Promise<
            ResponseWrapped<Definition['methods'][CallName], 'UNARY'>
          >((resolve, reject) => {
            (
              handler as ClientHandler<Definition['methods'][CallName], 'UNARY'>
            )(
              req as RequestWrapped<Definition['methods'][CallName], 'UNARY'>,
              (reason, value) => {
                if (reason) reject(reason);
                else resolve(value);
              },
            );
          });
          return res as Promise<
            ResponseWrapped<Definition['methods'][CallName]>
          >;
        };
      }
      if (!requestStream && responseStream) {
        return (req: RequestWrapped<Definition['methods'][CallName]>) => {
          const res = new Promise<
            ResponseWrapped<Definition['methods'][CallName], 'SERVER'>
          >((resolve) => {
            resolve(
              (
                handler as ClientHandler<
                  Definition['methods'][CallName],
                  'SERVER'
                >
              )(
                req as RequestWrapped<
                  Definition['methods'][CallName],
                  'SERVER'
                >,
              ),
            );
          });
          return res as Promise<
            ResponseWrapped<Definition['methods'][CallName]>
          >;
        };
      }
      if (requestStream && !responseStream) {
        return (req: RequestWrapped<Definition['methods'][CallName]>) => {
          const res = new Promise<
            ResponseWrapped<Definition['methods'][CallName], 'CLIENT'>
          >((resolve, reject) => {
            const stream = (
              handler as ClientHandler<
                Definition['methods'][CallName],
                'CLIENT'
              >
            )((reason, value) => {
              if (reason) reject(reason);
              else resolve(value);
            });
            (async () => {
              for await (const reqItem of req as RequestWrapped<
                Definition['methods'][CallName],
                'CLIENT'
              >) {
                stream.write(reqItem);
              }
              stream.end();
            })();
          });
          return res as Promise<
            ResponseWrapped<Definition['methods'][CallName]>
          >;
        };
      }
      if (requestStream && responseStream) {
        return (req: RequestWrapped<Definition['methods'][CallName]>) => {
          const res = new Promise<
            ResponseWrapped<Definition['methods'][CallName], 'BIDI'>
          >((resolve) => {
            const stream = (
              handler as ClientHandler<Definition['methods'][CallName], 'BIDI'>
            )();
            (async () => {
              for await (const reqItem of req as RequestWrapped<
                Definition['methods'][CallName],
                'BIDI'
              >) {
                stream.write(reqItem);
              }
              stream.end();
            })();
            resolve(stream);
          });
          return res as Promise<
            ResponseWrapped<Definition['methods'][CallName]>
          >;
        };
      }
    }
    throw new TypeError('Invalid method');
  }
}

export { Client as default, type ClientOptions };
