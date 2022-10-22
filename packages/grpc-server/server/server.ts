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
  type Plugin,
  type PluginDefinition,
  type PluginHandler,
} from './plugin';
import Request, { type RequestRaw, type RequestWrapped } from './request';
import Response, { type ResponseRaw, type ResponseWrapped } from './response';
import { type RpcType } from './type';

type ServerOptions = ChannelOptions;

type ServerRaw = GrpcServer;

type ServerDefinition = MethodDefinition<unknown, unknown>;

type ServerHandler =
  | handleUnaryCall<unknown, unknown>
  | handleServerStreamingCall<unknown, unknown>
  | handleClientStreamingCall<unknown, unknown>
  | handleBidiStreamingCall<unknown, unknown>;

class Server {
  private definitions: Map<string, PluginDefinition<RpcType, unknown, unknown>>;
  private handlers: Map<string, PluginHandler<RpcType, unknown, unknown>>;
  private raw: ServerRaw;

  public constructor(options?: ServerOptions) {
    this.raw = new GrpcServer(options);
    this.definitions = new Map();
    this.handlers = new Map();
  }

  public callback(): [
    Record<string, ServerDefinition>,
    Record<string, ServerHandler>,
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
            ...args: RequestRaw<T, ReqMsg> & ResponseRaw<T, ResMsg>
          ) => {
            const { requestStream, responseStream } = this.definitions.get(
              path,
            ) as PluginDefinition<T, ReqMsg, ResMsg>;
            const pluginHandler = handler as (
              req: RequestWrapped<T, ReqMsg>,
            ) =>
              | ResponseWrapped<T, ResMsg>
              | Promise<ResponseWrapped<T, ResMsg>>;
            const request = new Request<T, ReqMsg>(requestStream, args);
            const response = new Response<T, ResMsg>(responseStream, args);
            if (requestStream && responseStream) {
              const stream = args[0] as ResponseRaw<'BIDI', ResMsg>[0];
              stream.on('end', () => stream.end());
            }
            const pluginRequest = request.getRequest();
            const pluginResponse = await (async () => {
              try {
                const pluginResponse = await pluginHandler(pluginRequest);
                return pluginResponse;
              } catch (e) {
                const pluginResponse: ResponseWrapped<T, ResMsg> =
                  e instanceof Error ? e : new Error(String(e));
                return pluginResponse;
              }
            })();
            await response.setResponse(pluginResponse);
            if (!requestStream && responseStream) {
              const stream = args[0] as ResponseRaw<'SERVER', ResMsg>[0];
              stream.end();
            }
          },
        ]),
      ),
    ];
  }

  public async close(): Promise<GrpcServer> {
    return new Promise((resolve, reject) =>
      this.raw.tryShutdown((e) => {
        if (e) {
          reject(e);
        } else {
          resolve(this.raw);
        }
      }),
    );
  }

  public listen(port?: number, hostname?: string): Promise<GrpcServer> {
    this.raw.addService(...this.callback());
    return new Promise((resolve, reject) =>
      this.raw.bindAsync(
        `${hostname || 'localhost'}:${port || 0}`,
        ServerCredentials.createInsecure(),
        (e) => {
          if (e) {
            reject(e);
          } else {
            this.raw.start();
            resolve(this.raw);
          }
        },
      ),
    );
  }

  public use<ReqMsg, ResMsg>(plugin: Plugin<RpcType, ReqMsg, ResMsg>): void {
    this.definitions.set(
      plugin.definition.path,
      plugin.definition as PluginDefinition<RpcType, unknown, unknown>,
    );
    this.handlers.set(
      plugin.definition.path,
      plugin.handler as PluginHandler<RpcType, unknown, unknown>,
    );
  }
}

export {
  Server as default,
  type ServerDefinition,
  type ServerHandler,
  type ServerOptions,
};
