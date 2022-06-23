import { json, text } from 'co-body';
import formidable from 'formidable';
import { type IncomingMessage } from 'http';
import typeis from 'type-is';
import { type HandlerRequest } from './handler';
import {
  type HttpType,
  type ServerRequest,
  type ServerRequestHeaders,
} from './server';

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

interface MultipartFile {
  name: string | null;
  path: string;
  size: number;
  type: string | null;
}
class Request<T extends HttpType = 'HTTP'> {
  private originalValue: ServerRequest<T>;

  public constructor(req: ServerRequest<T>) {
    this.originalValue = req;
  }

  public async getBody<Body>(): Promise<Body | undefined> {
    const req = this.originalValue as IncomingMessage;
    if (typeis(req, formTypes)) {
      return this.getBodyForm<Body>();
    } else if (typeis(req, jsonTypes)) {
      return this.getBodyJson<Body>();
    } else if (typeis(req, textTypes)) {
      return this.getBodyText<Body>();
    } else if (typeis(req, xmlTypes)) {
      return this.getBodyXml<Body>();
    }
  }

  public getHeaders(): ServerRequestHeaders<T> {
    return this.originalValue.headers;
  }

  public getMethod(): string {
    return this.originalValue.method || '';
  }

  public getRequest(): HandlerRequest {
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

  private async getBodyForm<Body>(): Promise<Body> {
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
            resolve(value as Body);
          }
        },
      );
    });
  }

  private async getBodyJson<Body>(): Promise<Body> {
    return json(this.originalValue as IncomingMessage);
  }

  private async getBodyText<Body>(): Promise<Body> {
    return text(this.originalValue as IncomingMessage);
  }

  private async getBodyXml<Body>(): Promise<Body> {
    return text(this.originalValue as IncomingMessage);
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

export { Request as default, type MultipartFile };
