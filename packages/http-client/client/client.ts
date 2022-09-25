import { type PluginRequest } from './request';
import { type PluginResponse } from './response';

interface ClientOptions {
  defaultMethod?: string;
  defaultURL?: string | URL;
  defaultHeaders?: HeadersInit;
}

class Client {
  defaultMethod: string;
  defaultURL: URL;
  defaultHeaders: Headers;

  constructor(options: ClientOptions) {
    this.defaultMethod = options?.defaultMethod || 'GET';
    this.defaultURL = new URL(options?.defaultURL || 'http://localhost');
    this.defaultHeaders = new Headers(options?.defaultHeaders);
  }

  async call(req: PluginRequest): Promise<PluginResponse> {
    const url = new URL(req.url || '', this.defaultURL);
    const method = req.method || this.defaultMethod;
    const headers = new Headers(this.defaultHeaders);
    const extraHeaders = new Headers(req.headers);
    for (const header of extraHeaders) {
      headers.set(...header);
    }
    const res = await globalThis.fetch(url, {
      method: method,
      headers: headers,
      body: req.body || null,
    });
    return {
      code: res.status,
      message: res.statusText,
      headers: res.headers,
      body: res,
    };
  }
}

export { Client as default, type ClientOptions };
