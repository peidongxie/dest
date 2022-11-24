import {
  Server as GrpcServer,
  ServerCredentials,
  type ChannelOptions,
  type ServiceDefinition,
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type handleUnaryCall,
} from '@grpc/grpc-js';
import { type Plugin, type PluginMethod } from './plugin';
import Request, {
  type RequestRaw,
  type RequestStream,
  type RequestWrapped,
} from './request';
import Response, {
  type ResponseRaw,
  type ResponseStream,
  type ResponseWrapped,
} from './response';
import { type RpcType } from './type';

type ServerOptions = ChannelOptions;

type ServerRaw = GrpcServer;

type ServerDefinition = ServiceDefinition[keyof ServiceDefinition];

type ServerImplementation =
  | handleUnaryCall<unknown, unknown>
  | handleServerStreamingCall<unknown, unknown>
  | handleClientStreamingCall<unknown, unknown>
  | handleBidiStreamingCall<unknown, unknown>;

class Server {
  private raw: ServerRaw;
  private services: Map<
    string,
    Map<string, PluginMethod<RpcType, unknown, unknown>>
  >;

  public constructor(options?: ServerOptions) {
    this.raw = new GrpcServer(options);
    this.services = new Map();
  }

  public callback(): [
    Record<string, ServerDefinition>,
    Record<string, ServerImplementation>,
  ][] {
    return Array.from(this.services.entries()).map(([serviceName, methods]) => {
      return [
        Object.fromEntries(
          Array.from(methods.entries()).map(
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
                requestDeserialize: (value: Buffer) =>
                  requestType.decode(value),
                responseSerialize: (value: typeof responseType) =>
                  Buffer.from(responseType.encode(value).finish()),
                responseDeserialize: (value: Buffer) =>
                  responseType.decode(value),
              },
            ],
          ),
        ),
        Object.fromEntries(
          Array.from(methods.entries()).map(
            ([methodName, { requestStream, responseStream, handler }]) => [
              methodName,
              async <T extends RpcType, ReqMsg, ResMsg>(
                ...args: RequestRaw<T, ReqMsg> & ResponseRaw<T, ResMsg>
              ) => {
                const pluginHandler = handler as (
                  req: RequestWrapped<T, ReqMsg>,
                ) =>
                  | ResponseWrapped<T, ResMsg>
                  | Promise<ResponseWrapped<T, ResMsg>>;
                const request = new Request<T, ReqMsg>(
                  requestStream as RequestStream<T>,
                  args,
                );
                const response = new Response<T, ResMsg>(
                  responseStream as ResponseStream<T>,
                  args,
                );
                if (requestStream && responseStream) {
                  const stream = args[0] as ResponseRaw<'BIDI', ResMsg>[0];
                  stream.on('end', () => stream.end());
                }
                const requestWrapped = request.getRequest();
                const responseWrapped = await (async (): Promise<
                  ResponseWrapped<T, ResMsg>
                > => {
                  try {
                    const responseWrapped = await pluginHandler(requestWrapped);
                    return responseWrapped;
                  } catch (e) {
                    const responseWrapped =
                      e instanceof Error ? e : new Error(String(e));
                    return responseWrapped;
                  }
                })();
                await response.setResponse(responseWrapped);
                if (!requestStream && responseStream) {
                  const stream = args[0] as ResponseRaw<'SERVER', ResMsg>[0];
                  stream.end();
                }
              },
            ],
          ),
        ),
      ];
    });
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
    for (const [definition, implementation] of this.callback()) {
      this.raw.addService(definition, implementation);
    }
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
    if (this.services.has(plugin.service)) {
      this.services.set(plugin.service, new Map());
    }
    const service = this.services.get(plugin.service);
    service?.set(
      plugin.method.name,
      plugin.method as PluginMethod<RpcType, unknown, unknown>,
    );
  }
}

export { Server as default, type ServerOptions };
