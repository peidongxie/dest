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
import Cors from './access-controller';
import defaultHandler, { type Handler } from './handler';
import Request from './request';
import Response from './response';
import Router from './restful-router';

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

class Server<T extends HttpType = 'HTTP'> {
  private accessController: Cors;
  private restfulRouter: Router;
  private originalValue: ServerOriginalValue<T>;
  private type: ServerType<T>;

  public constructor(type: ServerType<T>, options?: ServerOptions<T>) {
    this.accessController = new Cors();
    this.restfulRouter = new Router();
    this.type = type;
    const map = {
      http: httpCreateServer,
      https: httpsCreateServer,
      http2: createSecureServer,
    };
    const creator = map[type] as ServerCreator<T>;
    this.originalValue = creator(options);
  }

  public callback(): ServerListener<T> {
    return async (req, res) => {
      const request = new Request<T>(req);
      const response = new Response<T>(res);
      const extraHeaders = this.getExtraHeaders(request);
      const handler = this.getHandler(request);
      try {
        const handlerRequest = request.getRequest();
        const handlerResponse = (await handler(handlerRequest)) ?? {};
        response.setResponse({
          ...handlerResponse,
          headers: {
            ...extraHeaders,
            ...handlerResponse.headers,
          },
        });
      } catch (e) {
        if (e instanceof Error) {
          response.setResponse({ headers: extraHeaders, body: e });
        } else {
          response.setResponse({ code: 500, headers: extraHeaders });
        }
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

  public cors(
    options?:
      | {
          allowHeaders?: string;
          allowMethods?: string;
          allowOrigin?: (origin: string) => boolean;
          maxAge?: number;
        }
      | boolean,
  ): void {
    if (options === undefined || options === true) {
      this.accessController.setEnable(true);
    } else if (options === false) {
      this.accessController.setEnable(false);
    } else {
      const { allowHeaders, allowMethods, allowOrigin, maxAge } = options;
      this.accessController.setEnable(true);
      this.accessController.setAllowOptions({
        ...(allowHeaders && { headers: allowHeaders }),
        ...(allowMethods && { methods: allowMethods }),
        ...(allowOrigin && { origin: allowOrigin }),
      });
      if (maxAge !== undefined) this.accessController.setMaxAge(maxAge);
    }
  }

  public listen(port?: number, hostname?: string): ServerOriginalValue<T> {
    this.originalValue.on('request', this.callback());
    this.originalValue.listen(
      port || (this.type === 'http' ? 80 : 443),
      hostname || 'localhost',
    );
    return this.originalValue;
  }

  public route(
    method: string | string[],
    pathname: string | RegExp,
    handler?: Handler,
  ): void {
    this.restfulRouter.setRoute(method, pathname, handler);
  }

  private getExtraHeaders(request: Request<T>): ServerResponseHeaders {
    return {
      ...this.accessController.getExtraHeaders(
        request.getMethod(),
        request.getHeaders().origin,
      ),
      ...this.restfulRouter.getExtraHeaders(),
    };
  }

  private getHandler(request: Request<T>): Handler {
    return (
      this.accessController.getHandler(
        request.getMethod(),
        request.getHeaders().origin,
      ) ||
      this.restfulRouter.getHandler(
        request.getMethod(),
        request.getUrl().pathname,
      ) ||
      defaultHandler
    );
  }
}

export {
  Server as default,
  type HttpType,
  type ServerCreator,
  type ServerListener,
  type ServerOptions,
  type ServerOriginalValue,
  type ServerRequest,
  type ServerRequestHeaders,
  type ServerResponse,
  type ServerResponseHeaders,
  type ServerType,
};
