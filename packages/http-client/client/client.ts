import { Blob, Buffer } from 'buffer';
import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';
import { isAnyArrayBuffer, isArrayBufferView, isNativeError } from 'util/types';
import { URL } from 'url';
import { type Plugin, type PluginHandler } from './plugin';
import { type RequestWrapped } from './request';
import { type ResponseWrapped } from './response';

interface ClientOptions {
  defaultMethod?: string;
  defaultUrl?: string | URL;
  defaultHeaders?: HeadersInit;
}

class Client {
  private reqHandlers: PluginHandler<RequestWrapped>[];
  private resHandlers: PluginHandler<ResponseWrapped>[];

  constructor(options?: ClientOptions) {
    this.reqHandlers = [
      (req) => {
        const method = req.method || options?.defaultMethod || 'GET';
        const url = new URL(
          req.url?.toString() || '',
          options?.defaultUrl || 'http://localhost/',
        );
        const headers = new Headers(options?.defaultHeaders);
        for (const header of new Headers(req.headers)) {
          headers.set(...header);
        }
        const body = req.body || null;
        return {
          method,
          url,
          headers,
          body,
        };
      },
    ];
    this.resHandlers = [];
  }

  public async call(req: RequestWrapped): Promise<ResponseWrapped> {
    let requestWrapped = req;
    for (const pluginHandler of this.reqHandlers) {
      requestWrapped = await pluginHandler(req);
    }
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
    let responseWrapped: ResponseWrapped = {
      code: fetchRes.status,
      message: fetchRes.statusText,
      headers: fetchRes.headers,
      body: fetchRes,
    };
    for (const pluginHandler of this.resHandlers) {
      responseWrapped = await pluginHandler(responseWrapped);
    }
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
