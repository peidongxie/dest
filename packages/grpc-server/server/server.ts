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
import {
  type CommonDefinition,
  type CommonHandler,
  type CommonPlugin,
  type CommonType,
  type PluginHandler,
  type PluginType,
} from './plugin';
import Request, { type ServerRequest } from './request';
import Response, { type PluginResponse, type ServerResponse } from './response';
import { type RpcType } from './type';

type ServerDefinition<ReqMsg, ResMsg> = MethodDefinition<ReqMsg, ResMsg>;

interface ServerHandlerMap<ReqMsg, ResMsg> {
  UNARY: handleUnaryCall<ReqMsg, ResMsg>;
  SERVER: handleServerStreamingCall<ReqMsg, ResMsg>;
  CLIENT: handleClientStreamingCall<ReqMsg, ResMsg>;
  BIDI: handleBidiStreamingCall<ReqMsg, ResMsg>;
}

type ServerHandler<T extends RpcType, ReqMsg, ResMsg> = ServerHandlerMap<
  ReqMsg,
  ResMsg
>[T];

class Server {
  private definitions: Map<string, CommonDefinition>;
  private handlers: Map<string, CommonHandler>;
  private originalValue: GrpcServer;
  private types: Map<string, CommonType>;

  public constructor(options?: ChannelOptions) {
    this.originalValue = new GrpcServer(options);
    this.definitions = new Map();
    this.handlers = new Map();
    this.types = new Map();
  }

  public callback(): [
    Record<string, ServerDefinition<unknown, unknown>>,
    Record<
      string,
      | ServerHandler<'UNARY', unknown, unknown>
      | ServerHandler<'SERVER', unknown, unknown>
      | ServerHandler<'CLIENT', unknown, unknown>
      | ServerHandler<'BIDI', unknown, unknown>
    >,
  ] {
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
          async <T extends RpcType, ReqMsg, ResMsg>(
            ...args: ServerRequest<T, ReqMsg> & ServerResponse<T, ResMsg>
          ) => {
            const pluginType = this.types.get(path) as PluginType<T>;
            const pluginHandler = handler as CommonHandler<
              T,
              ReqMsg,
              ResMsg
            > as PluginHandler<T, ReqMsg, ResMsg>;
            const request = new Request<T, ReqMsg>(pluginType, args);
            const response = new Response<T, ResMsg>(pluginType, args);
            if (pluginType === 'bidi-streaming') {
              const stream = args[0] as ServerResponse<'BIDI', ResMsg>[0];
              stream.on('end', () => stream.end());
            }
            const pluginRequest = request.getRequest();
            const pluginResponse = await (async () => {
              try {
                const pluginResponse = await pluginHandler(pluginRequest);
                return pluginResponse;
              } catch (e) {
                const pluginResponse: PluginResponse<T, ResMsg> =
                  e instanceof Error ? e : new Error(String(e));
                return pluginResponse;
              }
            })();
            await response.setResponse(pluginResponse);
            if (pluginType === 'server-streaming') {
              const stream = args[0] as ServerResponse<'SERVER', ResMsg>[0];
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

  public use<ReqMsg, ResMsg>(
    plugin: CommonPlugin<RpcType, ReqMsg, ResMsg>,
  ): void {
    this.definitions.set(
      plugin.definition.path,
      plugin.definition as CommonDefinition,
    );
    this.handlers.set(plugin.definition.path, plugin.handler as CommonHandler);
    this.types.set(plugin.definition.path, plugin.type);
  }
}

export { Server as default, type ServerDefinition, type ServerHandler };
