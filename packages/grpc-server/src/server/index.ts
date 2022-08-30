import {
  Server as GrpcServer,
  ServerCredentials,
  type MethodDefinition,
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type handleUnaryCall,
} from '@grpc/grpc-js';

type RpcType =
  | 'Unary'
  | 'ServerStreaming'
  | 'ClientStreaming'
  | 'BidiStreaming';

type Definition<Request, Response> = MethodDefinition<Request, Response>;

type Implementation<
  Type extends RpcType,
  Request,
  Response,
> = Type extends 'Unary'
  ? handleUnaryCall<Request, Response>
  : Type extends 'ServerStreaming'
  ? handleServerStreamingCall<Request, Response>
  : Type extends 'ClientStreaming'
  ? handleClientStreamingCall<Request, Response>
  : Type extends 'BidiStreaming'
  ? handleBidiStreamingCall<Request, Response>
  : never;

interface Handler<Type extends RpcType, Request, Response> {
  type: Type;
  definition: Definition<Request, Response>;
  implementation: Implementation<Type, Request, Response>;
}

class Server {
  private handlers: Map<string, Handler<RpcType, unknown, unknown>>;
  private originalValue: GrpcServer;

  public constructor() {
    this.originalValue = new GrpcServer();
    this.handlers = new Map();
  }

  public callback(): [
    Record<string, Definition<unknown, unknown>>,
    Record<string, Implementation<RpcType, unknown, unknown>>,
  ] {
    const entries = Array.from(this.handlers.entries());
    return [
      Object.fromEntries(
        entries.map((entry) => [entry[0], entry[1].definition]),
      ),
      Object.fromEntries(
        entries.map((entry) => [entry[0], entry[1].implementation]),
      ),
    ];
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
    this.originalValue.addService(...this.callback());
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

  public use<Type extends RpcType, Request, Response>(
    handler: Handler<Type, Request, Response>,
  ): void {
    this.handlers.set(
      handler.definition.path,
      handler as Handler<RpcType, unknown, unknown>,
    );
  }
}

export { Server as default };
