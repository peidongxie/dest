import { Blob } from 'buffer';
import busboy from 'busboy';
import { randomUUID } from 'crypto';
import { createWriteStream } from 'fs';
import getStream from 'get-stream';
import { decodeStream } from 'iconv-lite';
import { tmpdir } from 'os';
import { type Readable } from 'stream';
import { URL } from 'url';
import MIMEType from 'whatwg-mimetype';
import { createBrotliDecompress, createGunzip, createInflate } from 'zlib';
import { type HandlerRequest } from './handler';
import {
  type HttpType,
  type ServerRequest,
  type ServerRequestHeaders,
} from './server';

interface Body {
  readonly body: Readable;
  readonly bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  formData(): Promise<Map<string, string | URL>>;
  json<T>(): Promise<T>;
  text(): Promise<string>;
}

class Request<T extends HttpType = 'HTTP'> {
  private originalValue: ServerRequest<T>;

  public constructor(req: ServerRequest<T>) {
    this.originalValue = req;
  }

  public getBody(): Body {
    let bodyUsed = false;
    return {
      body: this.originalValue,
      bodyUsed: bodyUsed,
      arrayBuffer: () => {
        if (bodyUsed) {
          throw new TypeError(
            "Failed to execute 'arrayBuffer' on 'Body': body stream already read",
          );
        }
        bodyUsed = true;
        return this.getBodyArrayBuffer();
      },
      blob: () => {
        if (bodyUsed) {
          throw new TypeError(
            "Failed to execute 'blob' on 'Body': body stream already read",
          );
        }
        bodyUsed = true;
        return this.getBodyBlob();
      },
      formData: () => {
        if (bodyUsed) {
          throw new TypeError(
            "Failed to execute 'formData' on 'Body': body stream already read",
          );
        }
        bodyUsed = true;
        return this.getBodyFormData();
      },
      json: <T>() => {
        if (bodyUsed) {
          throw new TypeError(
            "Failed to execute 'json' on 'Body': body stream already read",
          );
        }
        bodyUsed = true;
        return this.getBodyJson<T>();
      },
      text: () => {
        if (bodyUsed) {
          throw new TypeError(
            "Failed to execute 'text' on 'Body': body stream already read",
          );
        }
        bodyUsed = true;
        return this.getBodyText();
      },
    };
  }

  public getHeaders(): ServerRequestHeaders<T> {
    return this.originalValue.headers;
  }

  public getMethod(): string {
    return this.originalValue.method || '';
  }

  public getRequest(): HandlerRequest<T> {
    return {
      getMethod: this.getMethod.bind(this),
      getUrl: this.getUrl.bind(this),
      getHeaders: this.getHeaders.bind(this),
      getBody: this.getBody.bind(this),
    };
  }

  public getUrl(): URL {
    return new URL(
      this.originalValue.url || '',
      `${this.getUrlProtocol()}://${this.getUrlHost()}`,
    );
  }

  private async getBodyArrayBuffer(): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      getStream
        .buffer(this.readStream(reject))
        .then((buffer) =>
          resolve(
            buffer.buffer.slice(
              buffer.byteOffset,
              buffer.byteOffset + buffer.byteLength,
            ),
          ),
        );
    });
  }

  private getBodyBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      getStream.buffer(this.readStream(reject)).then((buffer) =>
        resolve(
          new Blob([buffer], {
            type: this.getMime()?.essence,
          }),
        ),
      );
    });
  }

  private getBodyFormData(): Promise<Map<string, string | URL>> {
    return new Promise((resolve, reject) => {
      const stream = busboy({});
      const formData = new Map<string, string | URL>();
      this.originalValue.pipe(stream);
      stream.on('field', (name, value) => {
        formData.set(name, value);
      });
      stream.on('file', (name, value) => {
        const url = new URL(
          `file://${tmpdir()}/dest-http-server-${Date.now()}-${randomUUID()}`,
        );
        value.pipe(createWriteStream(url));
        formData.set(name, url);
      });
      stream.on('finish', () => resolve(formData));
      stream.on('error', reject);
    });
  }

  private getBodyJson<T>(): Promise<T> {
    return new Promise((resolve, reject) => {
      getStream(this.readStream(reject)).then((text) =>
        resolve(JSON.parse(text)),
      );
    });
  }

  private getBodyText(): Promise<string> {
    return new Promise((resolve, reject) => {
      getStream(this.readStream(reject)).then((text) => resolve(text));
    });
  }

  private getHeadersItem(name: string): string {
    const header = this.getHeaders()[name];
    if (Array.isArray(header)) return header[0].split(/\s*,\s*/, 1)[0];
    if (header) return header.split(/\s*,\s*/, 1)[0];
    return '';
  }

  private getMime(): MIMEType | null {
    const type = this.originalValue.headers['content-type'];
    return type ? new MIMEType(type) : null;
  }

  private getUrlHost(): string {
    const http2 = this.originalValue.httpVersionMajor >= 2;
    return (
      this.getHeadersItem('x-forwarded-host') ||
      (http2 ? this.getHeadersItem(':authority') : '') ||
      this.getHeadersItem('host') ||
      'unknown'
    );
  }

  private getUrlProtocol(): string {
    const encrypted = Reflect.has(this.originalValue.socket, 'encrypted');
    return (
      (encrypted ? 'https' : '') ||
      this.getHeadersItem('x-forwarded-proto') ||
      'http'
    );
  }

  private readStream(callback: (err: Error) => void): NodeJS.ReadableStream {
    const encoding = this.originalValue.headers['content-encoding'];
    const charset = this.getMime()?.parameters.get('charset');
    const sourceStream: Readable = this.originalValue;
    const encodingStream: NodeJS.ReadWriteStream | null =
      encoding === 'br'
        ? createBrotliDecompress()
        : encoding === 'gzip'
        ? createGunzip()
        : encoding === 'deflate'
        ? createInflate()
        : null;
    const charsetStream: NodeJS.ReadWriteStream | null = charset
      ? decodeStream(charset)
      : null;
    let stream: NodeJS.ReadableStream = sourceStream;
    if (encodingStream) {
      stream = stream.pipe<NodeJS.ReadWriteStream>(encodingStream);
    }
    if (charsetStream) {
      stream = stream.pipe<NodeJS.ReadWriteStream>(charsetStream);
    }
    stream.on('error', callback);
    return stream;
  }
}

export { Request as default };
