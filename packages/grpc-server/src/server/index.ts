import {
  Server as GrpcServer,
  ServerCredentials,
  type MethodDefinition,
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type handleUnaryCall,
} from '@grpc/grpc-js';

type Definition<RequestType, ResponseType> = MethodDefinition<
  RequestType,
  ResponseType
>;

type Implementation<RequestType, ResponseType> =
  | handleUnaryCall<RequestType, ResponseType>
  | handleClientStreamingCall<RequestType, ResponseType>
  | handleServerStreamingCall<RequestType, ResponseType>
  | handleBidiStreamingCall<RequestType, ResponseType>;

type Handler<RequestType, ResponseType> = [
  Definition<RequestType, ResponseType>,
  Implementation<RequestType, ResponseType>,
];

class Server {
  private handlers: Map<string, Handler<unknown, unknown>>;
  private originalValue: GrpcServer;

  public constructor() {
    this.originalValue = new GrpcServer();
    this.handlers = new Map();
  }

  public async close(): Promise<GrpcServer> {
    return new Promise((resolve, reject) =>
      this.originalValue.tryShutdown((e) => {
        if (e) {
          reject(e);
        } else {
          resolve(this.originalValue);
        }
      }),
    );
  }

  public listen(port?: number, hostname?: string): Promise<GrpcServer> {
    return new Promise((resolve, reject) =>
      this.originalValue.bindAsync(
        `${hostname || 'localhost'}:${port || 0}`,
        ServerCredentials.createInsecure(),
        (e) => {
          if (e) {
            reject(e);
          } else {
            this.originalValue.start();
            resolve(this.originalValue);
          }
        },
      ),
    );
  }

  public use<RequestType, ResponseType>(
    definition: MethodDefinition<RequestType, ResponseType>,
    implementation: Implementation<RequestType, ResponseType>,
  ): void {
    const handler = [definition, implementation] as Handler<unknown, unknown>;
    this.handlers.set(definition.path, handler);
  }
}

export { Server as default };
