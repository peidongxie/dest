import { Blob, Buffer } from 'buffer';
import { randomUUID } from 'crypto';
import { type ServerResponse as HttpServerResponse } from 'http';
import { type Http2ServerResponse } from 'http2';
import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';
import { URLSearchParams } from 'url';
import { isAnyArrayBuffer, isArrayBufferView, isNativeError } from 'util/types';
import { type HttpType } from './type';

interface ResponseRawMap {
  HTTP: HttpServerResponse;
  HTTPS: HttpServerResponse;
  HTTP2: Http2ServerResponse;
}

type ResponseRaw<T extends HttpType> = ResponseRawMap[T];

interface ResponseWrapped {
  code?: Parameters<Response<HttpType>['setCode']>[0];
  message?: Parameters<Response<HttpType>['setMessage']>[0];
  headers?: Parameters<Response<HttpType>['setHeaders']>[0];
  body?: Parameters<Response<HttpType>['setBody']>[0];
}

class Response<T extends HttpType> {
  private originalValue: ResponseRaw<T>;

  public constructor(res: ResponseRaw<T>) {
    this.originalValue = res;
  }

  public setBody(
    value:
      | Buffer
      | ArrayBufferLike
      | ArrayBufferView
      | Blob
      | FormData
      | null
      | Readable
      | ReadableStream
      | string
      | Error
      | URLSearchParams
      | object,
  ): void {
    if (this.originalValue.writableEnded) return;
    if (value instanceof Buffer) {
      this.setBodyBuffer(value);
    } else if (isAnyArrayBuffer(value)) {
      this.setBodyBuffer(value);
    } else if (isArrayBufferView(value)) {
      this.setBodyBuffer(value);
    } else if (value instanceof Blob) {
      this.setBodyBuffer(value);
    } else if (value instanceof FormData) {
      this.setBodyBuffer(value);
    } else if (value === null) {
      this.setBodyNothing();
    } else if (value instanceof Readable) {
      this.setBodyStream(value);
    } else if (value instanceof ReadableStream) {
      this.setBodyStream(value);
    } else if (typeof value === 'string') {
      this.setBodyText(value);
    } else if (isNativeError(value)) {
      this.setBodyText(value);
    } else if (value instanceof URLSearchParams) {
      this.setBodyText(value);
    } else {
      this.setBodyText(value);
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

  public setResponse(res: ResponseWrapped): void {
    const { body, code, headers, message } = res;
    if (code !== undefined) this.setCode(code);
    if (message !== undefined) this.setMessage(message);
    if (headers !== undefined) this.setHeaders(headers);
    if (body !== undefined) this.setBody(body);
    else this.setBody(null);
  }

  private async setBodyBuffer(
    value: Buffer | ArrayBufferLike | ArrayBufferView | Blob | FormData,
  ): Promise<void> {
    const res = this.originalValue;
    const buffer =
      value instanceof Buffer
        ? value
        : isAnyArrayBuffer(value)
        ? Buffer.from(value)
        : isArrayBufferView(value)
        ? Buffer.from(value.buffer, value.byteOffset, value.byteLength)
        : value instanceof Blob
        ? Buffer.from(await value.arrayBuffer())
        : await (async () => {
            const buffers: Buffer[] = [];
            const boundary = 'boundary--' + randomUUID();
            for (const entries of value as FormData) {
              const [name, value] = entries;
              buffers.push(Buffer.from(`--${boundary}\r\n`));
              if (typeof value === 'string') {
                const disposition = [`form-data`, `name="${name}"`].join('; ');
                buffers.push(
                  Buffer.from(`Content-Disposition: ${disposition}\r\n`),
                );
                buffers.push(Buffer.from(`\r\n`));
                buffers.push(Buffer.from(value));
                buffers.push(Buffer.from(`\r\n`));
              } else {
                const disposition = [
                  `form-data`,
                  `name="${name}"`,
                  `filename="${value.name}"`,
                ].join('; ');
                buffers.push(
                  Buffer.from(`Content-Disposition: ${disposition}\r\n`),
                );
                buffers.push(
                  Buffer.from(`Content-Type: application/octet-stream\r\n`),
                );
                buffers.push(Buffer.from(`\r\n`));
                buffers.push(Buffer.from(await value.arrayBuffer()));
                buffers.push(Buffer.from(`\r\n`));
              }
            }
            buffers.push(Buffer.from(`--${boundary}--\r\n`));
            return Buffer.concat(buffers);
          })();
    this.setHeadersItem('Content-Length', buffer.byteLength);
    if (!res.hasHeader('Content-Type')) {
      this.setHeadersItem(
        'Content-Type',
        value instanceof Buffer
          ? 'application/octet-stream'
          : isAnyArrayBuffer(value)
          ? 'application/octet-stream'
          : isArrayBufferView(value)
          ? 'application/octet-stream'
          : value instanceof Blob
          ? 'application/octet-stream'
          : 'multipart/form-data; boundary=' +
            buffer.subarray(2, buffer.indexOf('\r\n')),
      );
    }
    res.end(buffer);
  }

  private async setBodyNothing(): Promise<void> {
    const res = this.originalValue;
    if (res.statusCode === 200) this.setCode(204);
    res.end();
  }

  private async setBodyStream(value: Readable | ReadableStream): Promise<void> {
    const res = this.originalValue;
    const stream = value instanceof Readable ? value : Readable.fromWeb(value);
    if (!res.hasHeader('Content-Type')) {
      this.setHeadersItem('Content-Type', 'application/octet-stream');
    }
    stream.pipe(res);
  }

  private async setBodyText(
    value: string | Error | URLSearchParams | object,
  ): Promise<void> {
    const res = this.originalValue;
    const text =
      typeof value === 'string'
        ? value
        : isNativeError(value)
        ? value.toString()
        : value instanceof URLSearchParams
        ? value.toString()
        : JSON.stringify(value, (key, value) => {
            return typeof value === 'bigint' ? value.toString() + 'n' : value;
          });
    if (res.statusCode === 200) {
      this.setCode(
        typeof value === 'string'
          ? 200
          : isNativeError(value)
          ? 500
          : value instanceof URLSearchParams
          ? 200
          : 200,
      );
    }
    this.setHeadersItem('Content-Length', Buffer.byteLength(text));
    if (!res.hasHeader('Content-Type')) {
      this.setHeadersItem(
        'Content-Type',
        typeof value === 'string'
          ? 'text/plain; charset=utf-8'
          : isNativeError(value)
          ? 'text/plain; charset=utf-8'
          : value instanceof URLSearchParams
          ? 'application/x-www-form-urlencoded; charset=utf-8'
          : 'application/json; charset=utf-8',
      );
    }
    res.end(text);
  }

  private setHeadersItem(
    name: string,
    value: string | number | readonly string[],
  ): void {
    this.originalValue.setHeader(name, value);
  }
}

export { Response as default, type ResponseRaw, type ResponseWrapped };
