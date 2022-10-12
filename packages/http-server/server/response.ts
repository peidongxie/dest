import { Blob, Buffer } from 'buffer';
import { randomUUID } from 'crypto';
import { type ServerResponse as HttpServerResponse } from 'http';
import { type Http2ServerResponse } from 'http2';
import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';
import { URLSearchParams } from 'url';
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
      | Int8Array
      | Uint8Array
      | Uint8ClampedArray
      | Int16Array
      | Uint16Array
      | Int32Array
      | Uint32Array
      | Float32Array
      | Float64Array
      | BigInt64Array
      | BigUint64Array
      | ArrayBuffer
      | SharedArrayBuffer
      | Readable
      | ReadableStream
      | Blob
      | object,
  ): void {
    if (this.originalValue.writableEnded) return;
    if (value === null) {
      this.setBodyNothing();
    } else if (value instanceof Error) {
      this.setBodyError(value);
    } else if (typeof value === 'string') {
      this.setBodyText(value);
    } else if (value instanceof Int8Array) {
      this.setBodyBuffer(value);
    } else if (value instanceof Uint8Array) {
      this.setBodyBuffer(value);
    } else if (value instanceof Uint8ClampedArray) {
      this.setBodyBuffer(value);
    } else if (value instanceof Int16Array) {
      this.setBodyBuffer(value);
    } else if (value instanceof Uint16Array) {
      this.setBodyBuffer(value);
    } else if (value instanceof Int32Array) {
      this.setBodyBuffer(value);
    } else if (value instanceof Uint32Array) {
      this.setBodyBuffer(value);
    } else if (value instanceof Float32Array) {
      this.setBodyBuffer(value);
    } else if (value instanceof Float64Array) {
      this.setBodyBuffer(value);
    } else if (value instanceof BigInt64Array) {
      this.setBodyBuffer(value);
    } else if (value instanceof BigUint64Array) {
      this.setBodyBuffer(value);
    } else if (value instanceof ArrayBuffer) {
      this.setBodyBuffer(value);
    } else if (value instanceof SharedArrayBuffer) {
      this.setBodyBuffer(value);
    } else if (value instanceof Readable) {
      this.setBodyStream(value);
    } else if (value instanceof ReadableStream) {
      this.setBodyStream(value);
    } else if (value instanceof Blob) {
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
    value:
      | Int8Array
      | Uint8Array
      | Uint8ClampedArray
      | Int16Array
      | Uint16Array
      | Int32Array
      | Uint32Array
      | Float32Array
      | Float64Array
      | BigInt64Array
      | BigUint64Array
      | ArrayBuffer
      | SharedArrayBuffer,
  ): void {
    const res = this.originalValue;
    const buffer =
      value instanceof Buffer
        ? value
        : value instanceof ArrayBuffer || value instanceof SharedArrayBuffer
        ? Buffer.from(value)
        : Buffer.from(value.buffer, value.byteOffset, value.byteLength);
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

  private async setBodyForm(value: FormData | URLSearchParams): Promise<void> {
    const res = this.originalValue;
    const boundary = 'boundary--' + randomUUID();
    const buffers: Buffer[] = [];
    for (const entries of value) {
      const [name, value] = entries;
      buffers.push(Buffer.from(`--${boundary}\r\n`));
      if (typeof value === 'string') {
        const disposition = [`form-data`, `name="${name}"`].join('; ');
        buffers.push(Buffer.from(`Content-Disposition: ${disposition}\r\n`));
        buffers.push(Buffer.from(`\r\n`));
        buffers.push(Buffer.from(value));
        buffers.push(Buffer.from(`\r\n`));
      } else {
        const disposition = [
          `form-data`,
          `name="${name}"`,
          `filename="${value.name}"`,
        ].join('; ');
        buffers.push(Buffer.from(`Content-Disposition: ${disposition}\r\n`));
        buffers.push(Buffer.from(`\r\n`));
        buffers.push(Buffer.from(await value.arrayBuffer()));
        buffers.push(Buffer.from(`\r\n`));
      }
    }
    buffers.push(Buffer.from(`--${boundary}--\r\n`));
    const buffer = Buffer.concat(buffers);
    if (!this.originalValue.hasHeader('Content-Type')) {
      this.setHeadersItem(
        'Content-Type',
        'multipart/form-data; boundary=' + boundary,
      );
    }
    this.setHeadersItem('Content-Length', buffer.byteLength);
    res.end(buffer);
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

  private setBodyStream(value: Readable | ReadableStream | Blob): void {
    const res = this.originalValue;
    const readableStream =
      value instanceof Blob ? (value.stream() as ReadableStream) : value;
    const readable =
      readableStream instanceof ReadableStream
        ? Readable.fromWeb(readableStream)
        : readableStream;
    if (!this.originalValue.hasHeader('Content-Type')) {
      this.setHeadersItem('Content-Type', 'application/octet-stream');
    }
    readable.pipe(res);
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
