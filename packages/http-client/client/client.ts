import { Blob, Buffer } from 'buffer';
import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';
import { isAnyArrayBuffer, isArrayBufferView, isNativeError } from 'util/types';
import { type Plugin, type PluginHandler } from './plugin';
import { type RequestWrapped } from './request';
import { type ResponseWrapped } from './response';

interface ClientOptions {
  defaultMethod?: string;
  defaultURL?: string | URL;
  defaultHeaders?: HeadersInit;
}

class Client {
  private defaultMethod: string;
  private defaultHeaders: Headers;
  private defaultReqHandler = (): RequestWrapped => ({
    method: this.defaultMethod,
    url: this.defaultURL,
    headers: new Headers(this.defaultHeaders),
    body: null,
  });
  private defaultResHandler = (res: Response): ResponseWrapped => ({
    code: res.status,
    message: res.statusText,
    headers: res.headers,
    body: res,
  });
  private defaultURL: URL;
  private reqHandlers: PluginHandler<RequestWrapped>[];
  private resHandlers: PluginHandler<ResponseWrapped>[];

  constructor(options?: ClientOptions) {
    this.defaultMethod = options?.defaultMethod || 'GET';
    this.defaultURL = new URL(options?.defaultURL || 'http://localhost/');
    this.defaultHeaders = new Headers(options?.defaultHeaders);
    this.reqHandlers = [];
    this.resHandlers = [];
  }

  public async call(req: RequestWrapped): Promise<ResponseWrapped> {
    const requestWrapped = await (async () => {
      const requestWrapped = this.defaultReqHandler();
      for (const pluginHandler of this.reqHandlers) {
        const { method, url, headers, body } = await pluginHandler(req);
        if (method !== undefined) {
          requestWrapped.method = method;
        }
        if (url !== undefined) {
          requestWrapped.url = new URL(url, requestWrapped.url);
        }
        if (headers !== undefined) {
          for (const header of new Headers(headers)) {
            (requestWrapped.headers as Headers).set(...header);
          }
        }
        if (body !== undefined) {
          requestWrapped.body = body;
          break;
        }
      }
      return requestWrapped;
    })();
    const { body, headers, method, url } = requestWrapped;
    const fetchUrl = url as URL | RequestInfo;
    const fetchBody: BodyInit | null =
      body instanceof Buffer
        ? body
        : isAnyArrayBuffer(body)
        ? Buffer.from(body)
        : isArrayBufferView(body)
        ? body
        : body instanceof Blob
        ? (body as unknown as globalThis.Blob)
        : body instanceof FormData
        ? body
        : body === null
        ? body
        : body instanceof Readable
        ? Readable.toWeb(body)
        : body instanceof ReadableStream
        ? body
        : typeof body === 'string'
        ? body
        : isNativeError(body)
        ? body.toString()
        : body instanceof URLSearchParams
        ? body
        : JSON.stringify(body);
    const fetchHeaders = headers as HeadersInit;
    const fetchMethod = method as string;
    const fetchRes = await globalThis.fetch(fetchUrl, {
      body: fetchBody,
      headers: fetchHeaders,
      method: fetchMethod,
    });
    const res = this.defaultResHandler(fetchRes);
    const responseWrapped = await (async () => {
      const responseWrapped = { ...res };
      for (const pluginHandler of this.resHandlers) {
        const { code, message, headers, body } = await pluginHandler(res);
        if (code !== undefined) {
          responseWrapped.code = code;
        }
        if (message !== undefined) {
          responseWrapped.message = message;
        }
        if (headers !== undefined) {
          for (const header of new Headers(headers)) {
            responseWrapped.headers.set(...header);
          }
        }
        if (body !== undefined) {
          responseWrapped.body = body;
          break;
        }
      }
      return responseWrapped;
    })();
    return responseWrapped;
  }

  public use(plugin: Plugin): void {
    const reqHandler =
      typeof plugin === 'function' ? plugin : plugin?.getReqHandler?.();
    reqHandler && this.reqHandlers.push(reqHandler);
    const resHandler =
      typeof plugin === 'function' ? plugin : plugin?.getResHandler?.();
    resHandler && this.resHandlers.push(resHandler);
  }
}

export { Client as default, type ClientOptions };
