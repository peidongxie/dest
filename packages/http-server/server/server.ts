import {
  createServer as httpCreateServer,
  type IncomingHttpHeaders as HttpIncomingHttpHeaders,
  type IncomingMessage as HttpIncomingMessage,
  type OutgoingHttpHeaders as HttpOutgoingHttpHeaders,
  type ServerResponse as HttpServerResponse,
  type ServerOptions as HttpServerOptions,
} from 'http';
import {
  createSecureServer,
  type Http2ServerRequest,
  type Http2ServerResponse,
  type IncomingHttpHeaders as Http2IncomingHttpHeaders,
  type SecureServerOptions as Http2SecureServerOptions,
} from 'http2';
import {
  createServer as httpsCreateServer,
  type ServerOptions as HttpsServerOptions,
} from 'https';
import {
  type Handler,
  type HandlerRequest,
  type HandlerResponse,
  type Plugin,
} from './handler';
import Request from './request';
import Response from './response';

type HttpType = 'HTTP' | 'HTTPS' | 'HTTP2';

interface ServerTypeMap {
  HTTP: 'http';
  HTTPS: 'https';
  HTTP2: 'http2';
}

type ServerType<T extends HttpType = 'HTTP'> = ServerTypeMap[T];

interface ServerOptionsMap {
  HTTP: HttpServerOptions;
  HTTPS: HttpsServerOptions;
  HTTP2: Http2SecureServerOptions;
}

type ServerOptions<T extends HttpType = 'HTTP'> = ServerOptionsMap[T];

interface ServerOriginalValueMap {
  HTTP: ReturnType<typeof httpCreateServer>;
  HTTPS: ReturnType<typeof httpsCreateServer>;
  HTTP2: ReturnType<typeof createSecureServer>;
}

type ServerOriginalValue<T extends HttpType = 'HTTP'> =
  ServerOriginalValueMap[T];

interface ServerRequestMap {
  HTTP: HttpIncomingMessage;
  HTTPS: HttpIncomingMessage;
  HTTP2: Http2ServerRequest;
}

type ServerRequest<T extends HttpType = 'HTTP'> = ServerRequestMap[T];

interface ServerRequestHeadersMap {
  HTTP: HttpIncomingHttpHeaders;
  HTTPS: HttpIncomingHttpHeaders;
  HTTP2: Http2IncomingHttpHeaders;
}

type ServerRequestHeaders<T extends HttpType = 'HTTP'> =
  ServerRequestHeadersMap[T];

interface ServerResponseMap {
  HTTP: HttpServerResponse;
  HTTPS: HttpServerResponse;
  HTTP2: Http2ServerResponse;
}

type ServerResponse<T extends HttpType = 'HTTP'> = ServerResponseMap[T];

interface ServerResponseHeadersMap {
  HTTP: HttpOutgoingHttpHeaders;
  HTTPS: HttpOutgoingHttpHeaders;
  HTTP2: HttpOutgoingHttpHeaders;
}

type ServerResponseHeaders<T extends HttpType = 'HTTP'> =
  ServerResponseHeadersMap[T];

type ServerCreator<T extends HttpType = 'HTTP'> = (
  options?: ServerOptions<T>,
) => ServerOriginalValue<T>;

type ServerListener<T extends HttpType = 'HTTP'> = (
  req: ServerRequest<T>,
  res: ServerResponse<T>,
) => void;

const map = {
  http: httpCreateServer,
  https: httpsCreateServer,
  http2: createSecureServer,
};

class Server<T extends HttpType = 'HTTP'> {
  private handlers: Handler<T>[];
  private originalValue: ServerOriginalValue<T>;
  private type: ServerType<T>;

  public constructor(type: ServerType<T>, options?: ServerOptions<T>) {
    this.type = type;
    const creator = map[type] as ServerCreator<T>;
    this.originalValue = creator(options);
    this.handlers = [];
  }

  public callback(): ServerListener<T> {
    return async (req, res) => {
      const request = new Request<T>(req);
      const response = new Response<T>(res);
      const handlerRequest: HandlerRequest<T> = request.getRequest();
      const handlerResponse: HandlerResponse<T> = {};
      try {
        for (const handler of this.handlers) {
          const { code, message, headers, body } =
            (await handler(handlerRequest)) || {};
          if (code !== undefined) {
            handlerResponse.code = code;
          }
          if (message !== undefined) {
            handlerResponse.message = message;
          }
          if (headers !== undefined) {
            handlerResponse.headers = {
              ...handlerResponse.headers,
              ...headers,
            };
          }
          if (body !== undefined) {
            handlerResponse.body = body;
            break;
          }
        }
        response.setResponse(handlerResponse);
      } catch (e) {
        response.setResponse({
          code: 500,
          ...handlerResponse,
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
        port || (this.type === 'http' ? 80 : 443),
        hostname || 'localhost',
        () => {
          resolve(this.originalValue);
        },
      ),
    );
  }

  public use(plugin: Handler<T> | Plugin<T>): void {
    const handler =
      typeof plugin === 'function' ? plugin : plugin?.getHandler();
    handler && this.handlers.push(handler);
  }
}

export {
  Server as default,
  type HttpType,
  type ServerOptions,
  type ServerRequest,
  type ServerRequestHeaders,
  type ServerResponse,
  type ServerResponseHeaders,
  type ServerType,
};
