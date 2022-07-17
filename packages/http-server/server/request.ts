import formidable from 'formidable';
import { type IncomingMessage } from 'http';
import getRawBody from 'raw-body';
import { type Readable } from 'stream';
import typeIs from 'type-is';
import { createBrotliDecompress, createGunzip, createInflate } from 'zlib';
import { type HandlerRequest } from './handler';
import {
  type HttpType,
  type ServerRequest,
  type ServerRequestHeaders,
} from './server';

interface MultipartFile {
  name: string | null;
  path: string;
  size: number;
  type: string | null;
}

const form = formidable({ multiples: true });

const formTypes = ['multipart/form-data', 'application/x-www-form-urlencoded'];

const jsonTypes = [
  'application/json',
  'application/json-patch+json',
  'application/vnd.api+json',
  'application/csp-report',
];

const textTypes = ['text/plain'];

const xmlTypes = ['text/xml', 'application/xml'];

class Request<T extends HttpType = 'HTTP'> {
  private originalValue: ServerRequest<T>;

  public constructor(req: ServerRequest<T>) {
    this.originalValue = req;
  }

  public async getBody<Body = Readable>(): Promise<Body> {
    const req = this.originalValue as IncomingMessage;
    if (typeIs(req, formTypes)) {
      return this.getBodyForm() as Promise<Body>;
    } else if (typeIs(req, jsonTypes)) {
      return this.getBodyJson() as Promise<Body>;
    } else if (typeIs(req, textTypes)) {
      return this.getBodyText() as Promise<unknown> as Promise<Body>;
    } else if (typeIs(req, xmlTypes)) {
      return this.getBodyXml() as Promise<unknown> as Promise<Body>;
    }
    return req as unknown as Body;
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

  private async getBodyForm(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      form.parse(
        this.originalValue as IncomingMessage,
        (err, fields, files) => {
          if (err) {
            const reason = err;
            reject(reason);
          } else {
            const newFiles: Record<string, MultipartFile | MultipartFile[]> =
              {};
            for (const key in files) {
              const value = files[key];
              if (!Array.isArray(value)) {
                newFiles[key] = {
                  name: value.originalFilename,
                  path: value.filepath,
                  size: value.size,
                  type: value.mimetype,
                };
              } else {
                newFiles[key] = value.map((value) => ({
                  name: value.originalFilename,
                  path: value.filepath,
                  size: value.size,
                  type: value.mimetype,
                }));
              }
            }
            const value: unknown = { ...fields, ...newFiles };
            resolve(value);
          }
        },
      );
    });
  }

  private async getBodyJson(): Promise<unknown> {
    return JSON.parse(await this.getBodyText());
  }

  private async getBodyText(): Promise<string> {
    const encoding = this.originalValue.headers['content-encoding'];
    const stream =
      encoding === 'br'
        ? this.originalValue.pipe(createBrotliDecompress())
        : encoding === 'gzip'
        ? this.originalValue.pipe(createGunzip())
        : encoding === 'deflate'
        ? this.originalValue.pipe(createInflate())
        : this.originalValue;
    const options = { encoding: 'UTF-8' };
    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      getRawBody(stream, options, (err, body) => {
        if (err) reject(err);
        if (body) resolve(body);
      });
    });
  }

  private async getBodyXml(): Promise<string> {
    return this.getBodyText();
  }

  private getHeadersItem(name: string): string {
    const header = this.getHeaders()[name];
    if (Array.isArray(header)) return header[0].split(/\s*,\s*/, 1)[0];
    if (header) return header.split(/\s*,\s*/, 1)[0];
    return '';
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
}

export { Request as default };
