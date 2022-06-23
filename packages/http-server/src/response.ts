import { Stream } from 'stream';
import { type HandlerResponse } from './handler';
import {
  type HttpType,
  type ServerResponse,
  type ServerResponseHeaders,
} from './server';

type JsonItem = object;

class Response<T extends HttpType = 'HTTP'> {
  private originalValue: ServerResponse<T>;

  public constructor(res: ServerResponse<T>) {
    this.originalValue = res;
  }

  public setBody(
    value: null | string | Error | Buffer | Stream | JsonItem,
  ): void {
    if (this.originalValue.writableEnded) return;
    if (value === null) {
      this.setBodyNothing();
    } else if (typeof value === 'string') {
      this.setBodyText(value);
    } else if (value instanceof Error) {
      this.setBodyError(value);
    } else if (Buffer.isBuffer(value)) {
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

  public setHeaders(headers: ServerResponseHeaders): void {
    for (const key in headers) {
      const value = headers[key];
      if (value !== undefined) this.setHeadersItem(key, value);
    }
  }

  public setMessage(message: string): void {
    this.originalValue.statusMessage = message;
  }

  public setResponse(res: HandlerResponse): void {
    const { body, code, headers, message } = res;
    if (code !== undefined) this.setCode(code);
    if (message !== undefined) this.setMessage(message);
    if (headers !== undefined) this.setHeaders(headers);
    if (body !== undefined) this.setBody(body);
    else this.setBody(null);
  }

  private setBodyBuffer(value: Buffer): void {
    const res = this.originalValue;
    if (!this.originalValue.hasHeader('Content-Type')) {
      this.setHeadersItem('Content-Type', 'application/octet-stream');
    }
    this.setHeadersItem('Content-Length', value.length);
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

  private setBodyJson(value: JsonItem): void {
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

export { Response as default, type JsonItem };
