import {
  Server as GrpcServer,
  ServerCredentials,
  type MethodDefinition,
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type handleUnaryCall,
} from '@grpc/grpc-js';
import Handler from './handler';

type RpcType =
  | 'Unary'
  | 'ServerStreaming'
  | 'ClientStreaming'
  | 'BidiStreaming';

type Definition<Type extends RpcType, Request, Response> = Type extends
  | 'Unary'
  | 'ServerStreaming'
  | 'ClientStreaming'
  | 'BidiStreaming'
  ? MethodDefinition<Request, Response>
  : MethodDefinition<Request, Response>;

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

class Server {
  private handlers: Map<string, Handler<RpcType, unknown, unknown>>;
  private originalValue: GrpcServer;

  public constructor() {
    this.originalValue = new GrpcServer();
    this.handlers = new Map();
  }

  public callback(): [
    Record<string, Definition<RpcType, unknown, unknown>>,
    Record<string, Implementation<RpcType, unknown, unknown>>,
  ] {
    const entries = Array.from(this.handlers.entries());
    return [
      Object.fromEntries(
        entries.map(([path, handler]) => [path, handler.wrapDefinition()]),
      ),
      Object.fromEntries(
        entries.map(([path, handler]) => [path, handler.wrapImplementation()]),
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
    plugin: Pick<
      Handler<Type, Request, Response>,
      'type' | 'definition' | 'implementation'
    >,
  ): void {
    const handler = new Handler(
      plugin.type,
      plugin.definition,
      plugin.implementation,
    );
    this.handlers.set(
      handler.getPath(),
      handler as Handler<Type, unknown, unknown>,
    );
  }
}

export {
  Server as default,
  type Definition,
  type Implementation,
  type RpcType,
};
