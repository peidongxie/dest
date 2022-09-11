import { Blob } from 'buffer';
import busboy from 'busboy';
import { randomUUID } from 'crypto';
import { createWriteStream } from 'fs';
import getStream from 'get-stream';
import {
  type IncomingHttpHeaders as HttpIncomingHttpHeaders,
  type IncomingMessage as HttpIncomingMessage,
} from 'http';
import {
  type IncomingHttpHeaders as Http2IncomingHttpHeaders,
  type Http2ServerRequest,
} from 'http2';
import iconv from 'iconv-lite';
import { tmpdir } from 'os';
import { join } from 'path';
import { type Readable } from 'stream';
import { URL, pathToFileURL } from 'url';
import MIMEType from 'whatwg-mimetype';
import { createBrotliDecompress, createGunzip, createInflate } from 'zlib';
import { type HttpType } from './type';

type FormKey = string;

type FormValue = string | URL;

type FormEntry = [FormKey, FormValue] | Promise<[FormKey, FormValue]>;

interface Body {
  readonly body: Readable;
  readonly bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  formData(): Promise<Map<FormKey, FormValue>>;
  json<T>(): Promise<T>;
  text(): Promise<string>;
}

interface ServerRequestHeadersMap {
  HTTP: HttpIncomingHttpHeaders;
  HTTPS: HttpIncomingHttpHeaders;
  HTTP2: Http2IncomingHttpHeaders;
}

type ServerRequestHeaders<T extends HttpType> = ServerRequestHeadersMap[T];

interface ServerRequestMap {
  HTTP: HttpIncomingMessage;
  HTTPS: HttpIncomingMessage;
  HTTP2: Http2ServerRequest;
}

type ServerRequest<T extends HttpType> = ServerRequestMap[T];

interface PluginRequest<T extends HttpType> {
  method: ReturnType<Request<T>['getMethod']>;
  url: ReturnType<Request<T>['getUrl']>;
  headers: ReturnType<Request<T>['getHeaders']>;
  body: ReturnType<Request<T>['getBody']>;
}

class Request<T extends HttpType> {
  private originalValue: ServerRequest<T>;

  public constructor(req: ServerRequest<T>) {
    this.originalValue = req;
  }

  public getBody(): Body {
    let bodyUsed = false;
    return {
      body: this.originalValue,
      bodyUsed: bodyUsed,
      arrayBuffer: async () => {
        if (bodyUsed) {
          throw new TypeError(
            "Failed to execute 'arrayBuffer' on 'Body': body stream already read",
          );
        }
        bodyUsed = true;
        try {
          const arrayBuffer = await this.getBodyArrayBuffer();
          return arrayBuffer;
        } catch {
          throw new TypeError('Failed to decode body stream');
        }
      },
      blob: async () => {
        if (bodyUsed) {
          throw new TypeError(
            "Failed to execute 'blob' on 'Body': body stream already read",
          );
        }
        bodyUsed = true;
        try {
          const blob = await this.getBodyBlob();
          return blob;
        } catch {
          throw new TypeError('Failed to decode body stream');
        }
      },
      formData: async () => {
        if (bodyUsed) {
          throw new TypeError(
            "Failed to execute 'formData' on 'Body': body stream already read",
          );
        }
        bodyUsed = true;
        try {
          const formData = await this.getBodyFormData();
          return formData;
        } catch {
          throw new TypeError('Failed to decode body stream');
        }
      },
      json: async <T>() => {
        if (bodyUsed) {
          throw new TypeError(
            "Failed to execute 'json' on 'Body': body stream already read",
          );
        }
        bodyUsed = true;
        try {
          const json = await this.getBodyJson<T>();
          return json;
        } catch {
          throw new TypeError('Failed to decode body stream');
        }
      },
      text: async () => {
        if (bodyUsed) {
          throw new TypeError(
            "Failed to execute 'text' on 'Body': body stream already read",
          );
        }
        bodyUsed = true;
        try {
          const text = await this.getBodyText();
          return text;
        } catch {
          throw new TypeError('Failed to decode body stream');
        }
      },
    };
  }

  public getHeaders(): ServerRequestHeaders<T> {
    return this.originalValue.headers;
  }

  public getMethod(): string {
    return this.originalValue.method || '';
  }

  public getRequest(): PluginRequest<T> {
    return {
      method: this.getMethod(),
      url: this.getUrl(),
      headers: this.getHeaders(),
      body: this.getBody(),
    };
  }

  public getUrl(): URL {
    return new URL(
      this.originalValue.url || '',
      `${this.getUrlProtocol()}://${this.getUrlHost()}`,
    );
  }

  private async getBodyArrayBuffer(): Promise<ArrayBuffer> {
    const stream = this.pipeStream();
    const buffer = await getStream.buffer(stream);
    return buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    );
  }

  private async getBodyBlob(): Promise<Blob> {
    const stream = this.pipeStream();
    const buffer = await getStream.buffer(stream);
    return new Blob([buffer], {
      type: this.getMime()?.essence,
    });
  }

  private async getBodyFormData(): Promise<Map<string, string | URL>> {
    const sourceStream = this.pipeStream();
    const formEntries = await new Promise<FormEntry[]>((resolve, reject) => {
      const formEntries: FormEntry[] = [];
      const formStream = busboy({ headers: this.originalValue.headers });
      formStream.on('field', (name, value) => {
        formEntries.push([name, value]);
      });
      formStream.on('file', (name, value, info) => {
        formEntries.push(
          new Promise((resolve, reject) => {
            const mimeType = info.mimeType.replace('/', '-');
            const filename = info.filename.replace(/[^-.0-9A-Za-z]/g, '');
            const input = `${Date.now()}_${randomUUID()}_${mimeType}_${filename}`;
            const url = pathToFileURL(join(tmpdir(), input));
            const fileStream = createWriteStream(url);
            fileStream.on('close', () => resolve([name, url]));
            fileStream.on('error', reject);
            value.on('error', reject);
            value.pipe(fileStream);
          }),
        );
      });
      formStream.on('close', () => {
        resolve(formEntries);
      });
      formStream.on('error', reject);
      sourceStream.on('error', reject);
      sourceStream.pipe(formStream);
    });
    return new Map(await Promise.all(formEntries));
  }

  private async getBodyJson<T>(): Promise<T> {
    const stream = this.pipeStream();
    const text = await getStream(stream);
    return JSON.parse(text);
  }

  private async getBodyText(): Promise<string> {
    const stream = this.pipeStream();
    const text = await getStream(stream);
    return text;
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

  private pipeStream(): NodeJS.ReadableStream {
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
      ? iconv.decodeStream(charset)
      : null;
    let stream: NodeJS.ReadableStream = sourceStream;
    if (encodingStream) {
      stream = stream.pipe<NodeJS.ReadWriteStream>(encodingStream);
    }
    if (charsetStream) {
      stream = stream.pipe<NodeJS.ReadWriteStream>(charsetStream);
    }
    return stream;
  }
}

export { Request as default, type PluginRequest, type ServerRequest };
