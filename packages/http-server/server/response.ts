import { Buffer } from 'buffer';
import { type ServerResponse as HttpServerResponse } from 'http';
import { type Http2ServerResponse } from 'http2';
import { Readable, Stream } from 'stream';
import { ReadableStream } from 'stream/web';
import { type HttpType } from './type';

interface ServerResponseMap {
  HTTP: HttpServerResponse;
  HTTPS: HttpServerResponse;
  HTTP2: Http2ServerResponse;
}

type ServerResponse<T extends HttpType> = ServerResponseMap[T];

interface PluginResponse {
  code?: Parameters<Response<HttpType>['setCode']>[0];
  message?: Parameters<Response<HttpType>['setMessage']>[0];
  headers?: Parameters<Response<HttpType>['setHeaders']>[0];
  body?: Parameters<Response<HttpType>['setBody']>[0];
}

class Response<T extends HttpType> {
  private originalValue: ServerResponse<T>;

  public constructor(res: ServerResponse<T>) {
    this.originalValue = res;
  }

  public setBody(
    value:
      | null
      | Error
      | string
      | Uint8Array
      | ArrayBuffer
      | SharedArrayBuffer
      | Stream
      | ReadableStream
      | object,
  ): void {
    if (this.originalValue.writableEnded) return;
    if (value === null) {
      this.setBodyNothing();
    } else if (value instanceof Error) {
      this.setBodyError(value);
    } else if (typeof value === 'string') {
      this.setBodyText(value);
    } else if (value instanceof Uint8Array) {
      this.setBodyBuffer(value);
    } else if (value instanceof ArrayBuffer) {
      this.setBodyBuffer(value);
    } else if (value instanceof SharedArrayBuffer) {
      this.setBodyBuffer(value);
    } else if (value instanceof Stream) {
      this.setBodyStream(value);
    } else if (value instanceof ReadableStream) {
      this.setBodyStream(value);
    } else {
      this.setBodyJson(value);
    }
  }

  public setCode(code: number): void {
    this.originalValue.statusCode = code;
  }

  public setHeaders(headers: NodeJS.Dict<number | string | string[]>): void {
    for (const key in headers) {
      const value = headers[key];
      if (value !== undefined) this.setHeadersItem(key, value);
    }
  }

  public setMessage(message: string): void {
    this.originalValue.statusMessage = message;
  }

  public setResponse(res: PluginResponse): void {
    const { body, code, headers, message } = res;
    if (code !== undefined) this.setCode(code);
    if (message !== undefined) this.setMessage(message);
    if (headers !== undefined) this.setHeaders(headers);
    if (body !== undefined) this.setBody(body);
    else this.setBody(null);
  }

  private setBodyBuffer(
    value: Uint8Array | ArrayBuffer | SharedArrayBuffer,
  ): void {
    const res = this.originalValue;
    const buffer = value instanceof Uint8Array ? value : Buffer.from(value);
    if (!this.originalValue.hasHeader('Content-Type')) {
      this.setHeadersItem('Content-Type', 'application/octet-stream');
    }
    this.setHeadersItem('Content-Length', buffer.byteLength);
    res.end(buffer);
  }

  private setBodyError(value: Error): void {
    const res = this.originalValue;
    const str = value.message || 'Internal Server Error';
    if (this.originalValue.statusCode === 200) this.setCode(500);
    if (!this.originalValue.hasHeader('Content-Type')) {
      this.setHeadersItem('Content-Type', 'text/plain; charset=utf-8');
    }
    this.setHeadersItem('Content-Length', Buffer.byteLength(str));
    res.end(str);
  }

  private setBodyJson(value: object): void {
    const res = this.originalValue;
    const str = JSON.stringify(value, (key, value) => {
      return typeof value === 'bigint' ? value.toString() + 'n' : value;
    });
    if (!this.originalValue.hasHeader('Content-Type')) {
      this.setHeadersItem('Content-Type', 'application/json; charset=utf-8');
    }
    this.setHeadersItem('Content-Length', Buffer.byteLength(str));
    res.end(str);
  }

  private setBodyNothing(): void {
    const res = this.originalValue;
    if (this.originalValue.statusCode === 200) {
      this.setCode(204);
    }
    res.end();
  }

  private setBodyStream(value: Stream | ReadableStream): void {
    const res = this.originalValue;
    const stream = value instanceof Stream ? value : Readable.fromWeb(value);
    if (!this.originalValue.hasHeader('Content-Type')) {
      this.setHeadersItem('Content-Type', 'application/octet-stream');
    }
    stream.pipe(res);
  }

  private setBodyText(value: string): void {
    const res = this.originalValue;
    if (!this.originalValue.hasHeader('Content-Type')) {
      this.setHeadersItem('Content-Type', 'text/plain; charset=utf-8');
    }
    this.setHeadersItem('Content-Length', Buffer.byteLength(value));
    res.end(value);
  }

  private setHeadersItem(
    name: string,
    value: string | number | readonly string[],
  ): void {
    this.originalValue.setHeader(name, value);
  }
}

export { Response as default, type PluginResponse, type ServerResponse };
