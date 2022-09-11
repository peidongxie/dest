import {
  createServer as httpCreateServer,
  type ServerOptions as HttpServerOptions,
} from 'http';
import {
  createSecureServer,
  type SecureServerOptions as Http2SecureServerOptions,
} from 'http2';
import {
  createServer as httpsCreateServer,
  type ServerOptions as HttpsServerOptions,
} from 'https';
import Request, { type PluginRequest, type ServerRequest } from './request';
import Response, { type PluginResponse, type ServerResponse } from './response';
import { type Plugin, type PluginHandler } from './plugin';
import { type HttpType } from './type';

interface ServerTypeMap {
  HTTP: 'http';
  HTTPS: 'https';
  HTTP2: 'http2';
}

type ServerType<T extends HttpType> = ServerTypeMap[T];

interface ServerOptionsMap {
  HTTP: HttpServerOptions;
  HTTPS: HttpsServerOptions;
  HTTP2: Http2SecureServerOptions;
}

type ServerOptions<T extends HttpType> = ServerOptionsMap[T];

interface ServerOriginalValueMap {
  HTTP: ReturnType<typeof httpCreateServer>;
  HTTPS: ReturnType<typeof httpsCreateServer>;
  HTTP2: ReturnType<typeof createSecureServer>;
}

type ServerOriginalValue<T extends HttpType> = ServerOriginalValueMap[T];

type ServerCreator<T extends HttpType> = (
  options: ServerOptions<T>,
) => ServerOriginalValue<T>;

type ServerHandler<T extends HttpType> = (
  req: ServerRequest<T>,
  res: ServerResponse<T>,
) => void;

const creatorMap = {
  http: httpCreateServer,
  https: httpsCreateServer,
  http2: createSecureServer,
} as const;

const portMap = {
  http: 80,
  https: 443,
  http2: 443,
};

class Server<T extends HttpType> {
  private handlers: PluginHandler<T>[];
  private originalValue: ServerOriginalValue<T>;
  private type: ServerType<T>;

  public constructor(type: ServerType<T>, options?: ServerOptions<T>) {
    this.type = type;
    const creator = creatorMap[type] as ServerCreator<T>;
    this.originalValue = creator(options || {});
    this.handlers = [];
  }

  public callback(): ServerHandler<T> {
    return async (req, res) => {
      const request = new Request<T>(req);
      const response = new Response<T>(res);
      const pluginRequest: PluginRequest<T> = request.getRequest();
      const pluginResponse: PluginResponse<T> = {};
      try {
        for (const handler of this.handlers) {
          const { code, message, headers, body } =
            (await handler(pluginRequest)) || {};
          if (code !== undefined) {
            pluginResponse.code = code;
          }
          if (message !== undefined) {
            pluginResponse.message = message;
          }
          if (headers !== undefined) {
            pluginResponse.headers = {
              ...pluginResponse.headers,
              ...headers,
            };
          }
          if (body !== undefined) {
            pluginResponse.body = body;
            break;
          }
        }
        response.setResponse(pluginResponse);
      } catch (e) {
        response.setResponse({
          code: 500,
          ...pluginResponse,
          body: e instanceof Error ? e : String(e),
        });
      }
    };
  }

  public async close(): Promise<ServerOriginalValue<T>> {
    return new Promise((resolve, reject) =>
      this.originalValue.close((e) => {
        if (e) {
          reject(e);
        } else {
          resolve(this.originalValue);
        }
      }),
    );
  }

  public listen(
    port?: number,
    hostname?: string,
  ): Promise<ServerOriginalValue<T>> {
    this.originalValue.on('request', this.callback());
    return new Promise((resolve) =>
      this.originalValue.listen(
        port || portMap[this.type],
        hostname || 'localhost',
        () => {
          resolve(this.originalValue);
        },
      ),
    );
  }

  public use(plugin: PluginHandler<T> | Plugin<T>): void {
    const handler =
      typeof plugin === 'function' ? plugin : plugin?.getHandler();
    handler && this.handlers.push(handler);
  }
}

export {
  Server as default,
  type ServerHandler,
  type ServerOptions,
  type ServerType,
};
