import { Blob } from 'buffer';
import busboy from 'busboy';
import { randomUUID } from 'crypto';
import { createWriteStream } from 'fs';
import getStream from 'get-stream';
import iconv from 'iconv-lite';
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
      arrayBuffer: async () => {
        if (bodyUsed) {
          throw new TypeError(
            "Failed to execute 'arrayBuffer' on 'Body': body stream already read",
          );
        }
        bodyUsed = true;
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

  public getRequest(): HandlerRequest<T> {
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
    return new Promise((resolve, reject) => {
      const formData = new Map<string, string | URL>();
      const sourceStream = this.pipeStream();
      sourceStream.on('error', reject);
      const formStream = busboy({ headers: this.originalValue.headers });
      formStream.on('field', (name, value) => {
        formData.set(name, value);
      });
      formStream.on('file', (name, value, info) => {
        const mimeType = info.mimeType.replace('/', '-');
        const filename = info.filename.replaceAll(/\W/g, '');
        const url = new URL(
          `file://${tmpdir()}/${Date.now()}-${randomUUID()}-${mimeType}-${filename}`,
        );
        value.pipe(createWriteStream(url));
        formData.set(name, url);
      });
      formStream.on('finish', () => resolve(formData));
      formStream.on('error', reject);
      sourceStream.pipe(formStream);
    });
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

export { Request as default };
