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
import Request, { type ServerRequest } from './request';
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

type ServerHandler<T extends HttpType> = (
  req: ServerRequest<T>,
  res: ServerResponse<T>,
) => void;

type CreatorMap = {
  [T in HttpType as ServerType<T>]: (
    options: ServerOptions<T>,
  ) => ServerOriginalValue<T>;
};

const creatorMap: CreatorMap = {
  http: httpCreateServer,
  https: httpsCreateServer,
  http2: createSecureServer,
};

type PortMap = {
  [T in HttpType as ServerType<T>]: number;
};

const portMap: PortMap = {
  http: 80,
  https: 443,
  http2: 443,
};

class Server<T extends HttpType> {
  private handlers: PluginHandler[];
  private originalValue: ServerOriginalValue<T>;
  private type: ServerType<T>;

  public constructor(type: ServerType<T>, options?: ServerOptions<T>) {
    if (!['http', 'https', 'http2'].includes(type)) {
      throw new TypeError('Invalid server type');
    }
    this.type = type;
    const creator = creatorMap[type];
    this.originalValue = creator(options || {}) as ServerOriginalValue<T>;
    this.handlers = [];
  }

  public callback(): ServerHandler<T> {
    return async (req, res) => {
      const request = new Request<T>(req);
      const response = new Response<T>(res);
      const pluginRequest = request.getRequest();
      const pluginResponse = await (async () => {
        const pluginResponse: PluginResponse = {};
        try {
          for (const pluginHandler of this.handlers) {
            const { code, message, headers, body } =
              (await pluginHandler(pluginRequest)) || {};
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
          return pluginResponse;
        } catch (e) {
          const pluginResponse: PluginResponse = {
            code: 500,
            body: e instanceof Error ? e : String(e),
          };
          return pluginResponse;
        }
      })();
      response.setResponse(pluginResponse);
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

  public use(plugin: PluginHandler | Plugin): void {
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
