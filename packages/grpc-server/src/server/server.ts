import {
  Server as GrpcServer,
  ServerCredentials,
  type MethodDefinition,
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type handleUnaryCall,
} from '@grpc/grpc-js';
import { type Definition, type Handler, type Plugin } from './handler';

type RpcType =
  | 'Unary'
  | 'ServerStreaming'
  | 'ClientStreaming'
  | 'BidiStreaming';

type ServerService<T extends RpcType, ReqMsg, ResMsg> = T extends
  | 'Unary'
  | 'ServerStreaming'
  | 'ClientStreaming'
  | 'BidiStreaming'
  ? MethodDefinition<ReqMsg, ResMsg>
  : MethodDefinition<ReqMsg, ResMsg>;

type ServerRequest<T extends RpcType, ReqMsg> = T extends 'Unary'
  ? Parameters<handleUnaryCall<ReqMsg, unknown>>
  : T extends 'ServerStreaming'
  ? Parameters<handleServerStreamingCall<ReqMsg, unknown>>
  : T extends 'ClientStreaming'
  ? Parameters<handleClientStreamingCall<ReqMsg, unknown>>
  : T extends 'BidiStreaming'
  ? Parameters<handleBidiStreamingCall<ReqMsg, unknown>>
  : never;

type ServerResponse<T extends RpcType, ResMsg> = T extends 'Unary'
  ? Parameters<handleUnaryCall<unknown, ResMsg>>
  : T extends 'ServerStreaming'
  ? Parameters<handleServerStreamingCall<unknown, ResMsg>>
  : T extends 'ClientStreaming'
  ? Parameters<handleClientStreamingCall<unknown, ResMsg>>
  : T extends 'BidiStreaming'
  ? Parameters<handleBidiStreamingCall<unknown, ResMsg>>
  : never;

type ServerImplementation<T extends RpcType, ReqMsg, ResMsg> = T extends 'Unary'
  ? handleUnaryCall<ReqMsg, ResMsg>
  : T extends 'ServerStreaming'
  ? handleServerStreamingCall<ReqMsg, ResMsg>
  : T extends 'ClientStreaming'
  ? handleClientStreamingCall<ReqMsg, ResMsg>
  : T extends 'BidiStreaming'
  ? handleBidiStreamingCall<ReqMsg, ResMsg>
  : never;

type ServerListener = [
  Record<string, ServerService<RpcType, unknown, unknown>>,
  Record<string, ServerImplementation<RpcType, unknown, unknown>>,
];

class Server {
  private definitions: Map<string, Definition<RpcType, unknown, unknown>>;
  private handlers: Map<string, Handler<RpcType, unknown, unknown>>;
  private originalValue: GrpcServer;

  public constructor() {
    this.originalValue = new GrpcServer();
    this.definitions = new Map();
    this.handlers = new Map();
  }

  public callback(): ServerListener {
    return [
      Object.fromEntries(
        Array.from(this.definitions.entries()).map(([path, definition]) => [
          path,
          definition,
        ]),
      ),
      Object.fromEntries(
        Array.from(this.handlers.entries()).map(([path, handler]) => [
          path,
          handler,
        ]),
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

  public use<T extends RpcType, ReqMsg, ResMsg>(
    plugin: Plugin<T, ReqMsg, ResMsg>,
  ): void {
    this.definitions.set(
      plugin.definition.path,
      plugin.definition as Definition<T, unknown, unknown>,
    );
    this.handlers.set(
      plugin.definition.path,
      plugin.handler as Handler<T, unknown, unknown>,
    );
  }
}

export {
  Server as default,
  type RpcType,
  type ServerRequest,
  type ServerResponse,
  type ServerService as ServerDefinition,
  type ServerImplementation,
};
