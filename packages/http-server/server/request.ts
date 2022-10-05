import { Blob } from 'buffer';
import busboy from 'busboy';
import getStream from 'get-stream';
import { type IncomingMessage as HttpIncomingMessage } from 'http';
import { type Http2ServerRequest } from 'http2';
import iconv from 'iconv-lite';
import { type Readable } from 'stream';
import { URL } from 'url';
import MIMEType from 'whatwg-mimetype';
import { createBrotliDecompress, createGunzip, createInflate } from 'zlib';
import { type HttpType } from './type';

type FormEntry =
  | [string, string]
  | [string, Blob, string]
  | Promise<[string, string]>
  | Promise<[string, Blob, string]>;

interface Body {
  readonly body: Readable;
  readonly bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  formData(): Promise<FormData>;
  json<T>(): Promise<T>;
  text(): Promise<string>;
}

interface ServerRequestMap {
  HTTP: HttpIncomingMessage;
  HTTPS: HttpIncomingMessage;
  HTTP2: Http2ServerRequest;
}

type ServerRequest<T extends HttpType> = ServerRequestMap[T];

interface PluginRequest {
  method: ReturnType<Request<HttpType>['getMethod']>;
  url: ReturnType<Request<HttpType>['getUrl']>;
  headers: ReturnType<Request<HttpType>['getHeaders']>;
  body: ReturnType<Request<HttpType>['getBody']>;
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

  public getHeaders(): NodeJS.Dict<string | string[]> {
    return this.originalValue.headers;
  }

  public getMethod(): string {
    return this.originalValue.method || '';
  }

  public getRequest(): PluginRequest {
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

  private async getBodyFormData(): Promise<FormData> {
    const sourceStream = this.pipeStream();
    const formEntries = await new Promise<FormEntry[]>((resolve, reject) => {
      const formEntries: FormEntry[] = [];
      const formStream = busboy({ headers: this.originalValue.headers });
      formStream.on('field', (name, value) => {
        formEntries.push([name, value]);
      });
      formStream.on('file', (name, value, info) => {
        formEntries.push(
          (async () => {
            const buffer = await getStream.buffer(value);
            const blob = new Blob([buffer], {
              type: info.mimeType,
            });
            return [name, blob, info.filename];
          })(),
        );
      });
      formStream.on('close', () => {
        resolve(formEntries);
      });
      formStream.on('error', reject);
      sourceStream.on('error', reject);
      sourceStream.pipe(formStream);
    });
    const formData = new FormData();
    for await (const [name, value, filename] of formEntries) {
      if (typeof value === 'string') {
        formData.set(name, value);
      } else {
        formData.set(name, value as globalThis.Blob, filename);
      }
    }
    return formData;
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
    const encodingStream =
      encoding === 'br'
        ? createBrotliDecompress()
        : encoding === 'gzip'
        ? createGunzip()
        : encoding === 'deflate'
        ? createInflate()
        : null;
    const charsetStream = charset ? iconv.decodeStream(charset) : null;
    let stream: NodeJS.ReadableStream = sourceStream;
    if (encodingStream) {
      stream = stream.pipe(encodingStream);
    }
    if (charsetStream) {
      stream = stream.pipe(charsetStream);
    }
    return stream;
  }
}

export { Request as default, type PluginRequest, type ServerRequest };
