import {
  Server as GrpcServer,
  ServerCredentials,
  type ChannelOptions,
  type MethodDefinition,
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type handleUnaryCall,
} from '@grpc/grpc-js';
import { type HandlerResponse, type Plugin } from './handler';
import Request from './request';
import Response from './response';

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
  private plugins: Map<string, Plugin<RpcType, unknown, unknown>>;
  private originalValue: GrpcServer;

  public constructor(options?: ChannelOptions) {
    this.originalValue = new GrpcServer(options);
    this.plugins = new Map();
  }

  public callback(): ServerListener {
    return [
      Object.fromEntries(
        Array.from(this.plugins.entries()).map(([path, plugin]) => [
          path,
          plugin.definition,
        ]),
      ),
      Object.fromEntries(
        Array.from(this.plugins.entries()).map(([path, plugin]) => [
          path,
          async <T extends RpcType, ReqMsg, ResMsg>(
            ...args: ServerRequest<T, ReqMsg> & ServerResponse<T, ResMsg>
          ) => {
            const { type, handler } = plugin as Plugin<T, ReqMsg, ResMsg>;
            const request = new Request<T, ReqMsg>(type, args);
            const response = new Response<T, ResMsg>(type, args);
            if (type === 'BidiStreaming') {
              const stream = args[0] as ServerResponse<
                'BidiStreaming',
                ResMsg
              >[0];
              stream.on('end', () => stream.end());
            }
            const handlerRequest = request.getRequest();
            const handlerResponse = await (() => {
              try {
                return handler(handlerRequest);
              } catch (e) {
                return e as HandlerResponse<T, ResMsg>;
              }
            })();
            await response.setResponse(handlerResponse);
            if (type === 'ServerStreaming') {
              const stream = args[0] as ServerResponse<
                'ServerStreaming',
                ResMsg
              >[0];
              stream.end();
            }
          },
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
    this.plugins.set(
      plugin.definition.path,
      plugin as Plugin<T, unknown, unknown>,
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
