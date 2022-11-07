import { Blob, Buffer } from 'buffer';
import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';
import { isAnyArrayBuffer, isArrayBufferView, isNativeError } from 'util/types';
import { type RequestWrapped } from './request';
import { type ResponseWrapped } from './response';

interface ClientOptions {
  defaultMethod?: string;
  defaultURL?: string | URL;
  defaultHeaders?: HeadersInit;
}

class Client {
  private defaultMethod: string;
  private defaultURL: URL;
  private defaultHeaders: Headers;

  constructor(options?: ClientOptions) {
    this.defaultMethod = options?.defaultMethod || 'GET';
    this.defaultURL = new URL(options?.defaultURL || 'http://localhost');
    this.defaultHeaders = new Headers(options?.defaultHeaders);
  }

  public async call(req: RequestWrapped): Promise<ResponseWrapped> {
    const url = new URL(req.url || '', this.defaultURL);
    const method = req.method || this.defaultMethod;
    const extraHeaders = new Headers(req.headers);
    const headers = new Headers(this.defaultHeaders);
    for (const header of extraHeaders) {
      headers.set(...header);
    }
    const extraBody = req.body || null;
    const body: BodyInit | null =
      extraBody instanceof Buffer
        ? extraBody
        : isAnyArrayBuffer(extraBody)
        ? Buffer.from(extraBody)
        : isArrayBufferView(extraBody)
        ? extraBody
        : extraBody instanceof Blob
        ? extraBody
        : extraBody instanceof FormData
        ? extraBody
        : extraBody === null
        ? extraBody
        : extraBody instanceof Readable
        ? Readable.toWeb(extraBody)
        : extraBody instanceof ReadableStream
        ? extraBody
        : typeof extraBody === 'string'
        ? extraBody
        : isNativeError(extraBody)
        ? extraBody.toString()
        : extraBody instanceof URLSearchParams
        ? extraBody
        : JSON.stringify(extraBody);
    console.log(body, typeof body);
    const res = await globalThis.fetch(url, {
      method,
      headers,
      body,
    });
    return {
      code: res.status,
      message: res.statusText,
      headers: res.headers,
      body: res,
    };
  }
}

export { Client as default, type ClientOptions };
