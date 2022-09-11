import { Buffer } from 'buffer';
import {
  type OutgoingHttpHeaders as HttpOutgoingHttpHeaders,
  type ServerResponse as HttpServerResponse,
} from 'http';
import { type Http2ServerResponse } from 'http2';
import { Stream } from 'stream';
import { type HttpType } from './type';

interface ServerResponseHeadersMap {
  HTTP: HttpOutgoingHttpHeaders;
  HTTPS: HttpOutgoingHttpHeaders;
  HTTP2: HttpOutgoingHttpHeaders;
}

type ServerResponseHeaders<T extends HttpType> = ServerResponseHeadersMap[T];

interface ServerResponseMap {
  HTTP: HttpServerResponse;
  HTTPS: HttpServerResponse;
  HTTP2: Http2ServerResponse;
}

type ServerResponse<T extends HttpType> = ServerResponseMap[T];

interface PluginResponse<T extends HttpType> {
  code?: Parameters<Response<T>['setCode']>[0];
  message?: Parameters<Response<T>['setMessage']>[0];
  headers?: Parameters<Response<T>['setHeaders']>[0];
  body?: Parameters<Response<T>['setBody']>[0];
}

class Response<T extends HttpType> {
  private originalValue: ServerResponse<T>;

  public constructor(res: ServerResponse<T>) {
    this.originalValue = res;
  }

  public setBody(
    value: null | Error | string | Uint8Array | Stream | object,
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
    } else if (value instanceof Stream) {
      this.setBodyStream(value);
    } else {
      this.setBodyJson(value);
    }
  }

  public setCode(code: number): void {
    this.originalValue.statusCode = code;
  }

  public setHeaders(headers: ServerResponseHeaders<T>): void {
    for (const key in headers) {
      const value = headers[key];
      if (value !== undefined) this.setHeadersItem(key, value);
    }
  }

  public setMessage(message: string): void {
    this.originalValue.statusMessage = message;
  }

  public setResponse(res: PluginResponse<T>): void {
    const { body, code, headers, message } = res;
    if (code !== undefined) this.setCode(code);
    if (message !== undefined) this.setMessage(message);
    if (headers !== undefined) this.setHeaders(headers);
    if (body !== undefined) this.setBody(body);
    else this.setBody(null);
  }

  private setBodyBuffer(value: Uint8Array): void {
    const res = this.originalValue;
    if (!this.originalValue.hasHeader('Content-Type')) {
      this.setHeadersItem('Content-Type', 'application/octet-stream');
    }
    this.setHeadersItem('Content-Length', value.byteLength);
    res.end(value);
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

  private setBodyStream(value: Stream): void {
    const res = this.originalValue;
    if (!this.originalValue.hasHeader('Content-Type')) {
      this.setHeadersItem('Content-Type', 'application/octet-stream');
    }
    value.pipe(res);
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
