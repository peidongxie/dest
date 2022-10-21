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
import { isNativeError } from 'util/types';
import Request, { type RequestRaw } from './request';
import Response, { type ResponseRaw, type ResponseWrapped } from './response';
import { type Plugin, type PluginHandler } from './plugin';
import { type HttpType } from './type';

interface ServerTypeMap {
  HTTP: 'http';
  HTTPS: 'https';
  HTTP2: 'http2';
}

type ServerType =
  | ServerTypeMap['HTTP']
  | ServerTypeMap['HTTPS']
  | ServerTypeMap['HTTP2'];

interface ServerOptionsMap {
  HTTP: HttpServerOptions;
  HTTPS: HttpsServerOptions;
  HTTP2: Http2SecureServerOptions;
}

type ServerOptions =
  | ServerOptionsMap['HTTP']
  | ServerOptionsMap['HTTPS']
  | ServerOptionsMap['HTTP2'];

interface ServerRawMap {
  HTTP: ReturnType<typeof httpCreateServer>;
  HTTPS: ReturnType<typeof httpsCreateServer>;
  HTTP2: ReturnType<typeof createSecureServer>;
}

type ServerRaw =
  | ServerRawMap['HTTP']
  | ServerRawMap['HTTPS']
  | ServerRawMap['HTTP2'];

interface ServerHandlerMap {
  HTTP: (req: RequestRaw<'HTTP'>, res: ResponseRaw<'HTTP'>) => void;
  HTTPS: (req: RequestRaw<'HTTPS'>, res: ResponseRaw<'HTTPS'>) => void;
  HTTP2: (req: RequestRaw<'HTTP2'>, res: ResponseRaw<'HTTP2'>) => void;
}

type ServerHandler =
  | ServerHandlerMap['HTTP']
  | ServerHandlerMap['HTTPS']
  | ServerHandlerMap['HTTP2'];

const creatorMap: Record<string, (options: ServerOptions) => ServerRaw> = {
  http: httpCreateServer,
  https: httpsCreateServer,
  http2: createSecureServer,
};

const portMap: Record<string, number> = {
  http: 80,
  https: 443,
  http2: 443,
};

class Server {
  private handlers: PluginHandler[];
  private raw: ServerRaw;
  private type: ServerType;

  public constructor(type: ServerType, options?: ServerOptions) {
    if (!['http', 'https', 'http2'].includes(type)) {
      throw new TypeError('Invalid server type');
    }
    this.type = type;
    const creator = creatorMap[type];
    this.raw = creator(options || {});
    this.handlers = [];
  }

  public callback(): ServerHandler {
    return async (req: RequestRaw<HttpType>, res: ResponseRaw<HttpType>) => {
      const request = new Request(req);
      const response = new Response(res);
      const pluginRequest = request.getRequest();
      const pluginResponse = await (async () => {
        const pluginResponse: ResponseWrapped = {};
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
          const pluginResponse: ResponseWrapped = {
            code: 500,
            body: isNativeError(e) ? e : String(e),
          };
          return pluginResponse;
        }
      })();
      response.setResponse(pluginResponse);
    };
  }

  public async close(): Promise<ServerRaw> {
    return new Promise((resolve, reject) =>
      this.raw.close((e) => {
        if (e) {
          reject(e);
        } else {
          resolve(this.raw);
        }
      }),
    );
  }

  public listen(port?: number, hostname?: string): Promise<ServerRaw> {
    this.raw.on('request', this.callback());
    return new Promise((resolve) =>
      this.raw.listen(
        port || portMap[this.type],
        hostname || 'localhost',
        () => {
          resolve(this.raw);
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
