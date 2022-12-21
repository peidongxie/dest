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
import { PluginHandler, type Plugin } from './plugin';
import Request, { type RequestRaw, type RequestWrapped } from './request';
import Response, { type ResponseRaw, type ResponseWrapped } from './response';
import { type ProtoDefinition, type ProtoMethod } from './type';

type ServerOptions = ChannelOptions;

type ServerRaw = GrpcServer;

type ServerMeta = {
  methods: Map<string, ProtoMethod>;
  handlers: Map<string, PluginHandler<ProtoMethod>>;
};

type ServerDefinition = ServiceDefinition[keyof ServiceDefinition];

type ServerImplementation =
  | handleUnaryCall<
      ReturnType<
        ServiceDefinition[keyof ServiceDefinition]['requestDeserialize']
      >,
      Parameters<
        ServiceDefinition[keyof ServiceDefinition]['responseSerialize']
      >[0]
    >
  | handleServerStreamingCall<
      ReturnType<
        ServiceDefinition[keyof ServiceDefinition]['requestDeserialize']
      >,
      Parameters<
        ServiceDefinition[keyof ServiceDefinition]['responseSerialize']
      >[0]
    >
  | handleClientStreamingCall<
      ReturnType<
        ServiceDefinition[keyof ServiceDefinition]['requestDeserialize']
      >,
      Parameters<
        ServiceDefinition[keyof ServiceDefinition]['responseSerialize']
      >[0]
    >
  | handleBidiStreamingCall<
      ReturnType<
        ServiceDefinition[keyof ServiceDefinition]['requestDeserialize']
      >,
      Parameters<
        ServiceDefinition[keyof ServiceDefinition]['responseSerialize']
      >[0]
    >;

class Server {
  private meta: Map<string, ServerMeta>;
  private raw: ServerRaw;

  public constructor(options?: ServerOptions) {
    this.raw = new GrpcServer(options);
    this.meta = new Map();
  }

  public callback(): [
    Record<string, ServerDefinition>,
    Record<string, ServerImplementation>,
  ][] {
    return Array.from(this.meta).map(([serviceName, { methods, handlers }]) => {
      return [
        Object.fromEntries(
          Array.from(methods).map(
            ([
              callName,
              {
                name: methodName,
                requestType,
                requestStream,
                responseType,
                responseStream,
              },
            ]) => [
              callName,
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
          Array.from(handlers).map(([callName, handler]) => [
            callName,
            (async <Method extends ProtoMethod>(
              ...args: RequestRaw<Method> & ResponseRaw<Method>
            ) => {
              const pluginHandler = handler as (
                req: RequestWrapped<Method>,
              ) => ResponseWrapped<Method> | Promise<ResponseWrapped<Method>>;
              const { requestStream, responseStream } = methods.get(
                callName,
              ) as ProtoMethod;
              const request = new Request(requestStream, args);
              const response = new Response(responseStream, args);
              if (requestStream && responseStream) {
                const stream = args[0] as ResponseRaw<Method, 'BIDI'>[0];
                stream.on('end', () => stream.end());
              }
              const requestWrapped = request.getRequest();
              const responseWrapped = await (async () => {
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
                const stream = args[0] as ResponseRaw<Method, 'SERVER'>[0];
                stream.end();
              }
            }) as ServerImplementation,
          ]),
        ),
      ];
    });
  }

  public async close(): Promise<ServerRaw> {
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

  public listen(port?: number, hostname?: string): Promise<ServerRaw> {
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

  public use<Definition extends ProtoDefinition>(
    plugin: Plugin<Definition>,
  ): void {
    const serviceName = plugin.definition.fullName;
    if (!this.meta.has(serviceName)) {
      this.meta.set(serviceName, {
        methods: new Map(),
        handlers: new Map(),
      });
    }
    const { methods, handlers } = this.meta.get(serviceName) as ServerMeta;
    for (const [callName, handler] of Object.entries(plugin.handlers)) {
      const method = plugin.definition.methods[callName];
      methods.set(callName, method);
      handlers.set(callName, handler);
    }
  }
}

export { Server as default, type ServerOptions };
