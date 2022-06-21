import { type Handler } from './handler';
import { type ServerResponseHeaders } from './server';

interface AllowOptions {
  headers?: string;
  methods?: string;
  origin?: (origin: string) => boolean;
}

const forbiddenHandler = () => {
  return { code: 403 };
};

const preflightHandler = () => {
  return { code: 204 };
};

class AccessController {
  private allowOptions: Required<AllowOptions>;
  private enable: boolean;
  private maxAge: number;

  public constructor() {
    this.allowOptions = {
      headers: '*',
      methods: '*',
      origin: () => true,
    };
    this.enable = false;
    this.maxAge = 600;
  }

  public getExtraHeaders(
    method: string,
    origin?: string,
  ): ServerResponseHeaders {
    if (!this.enable) return {};
    if (origin === undefined) return {};
    if (!this.allowOptions.origin(origin)) return {};
    if (method === 'OPTIONS') {
      return {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': this.allowOptions.headers,
        'Access-Control-Allow-Methods': this.allowOptions.methods,
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Max-Age': this.maxAge,
      };
    }
    return {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': origin,
    };
  }

  public getHandler(method: string, origin?: string): Handler | null {
    if (!this.enable) return null;
    if (origin === undefined) return null;
    if (!this.allowOptions.origin(origin)) return forbiddenHandler;
    if (method === 'OPTIONS') return preflightHandler;
    return null;
  }

  public setAllowOptions(allOptions: AllowOptions): void {
    this.allowOptions = {
      ...this.allowOptions,
      ...allOptions,
    };
  }

  public setEnable(enable: boolean): void {
    this.enable = enable;
  }

  public setMaxAge(maxAge: number): void {
    this.maxAge = maxAge;
  }
}

export { AccessController as default };
