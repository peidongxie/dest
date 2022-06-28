import { type Handler, type HttpType, type Plugin } from '../server';

interface Route<T extends HttpType = 'HTTP'> {
  method: string[];
  pathname: RegExp;
  handler: Handler<T>;
}

interface Options {
  prefix?: string;
}

const validMethod = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'CONNECT',
  'OPTIONS',
  'PATCH',
  'TRACE',
];

class Router<T extends HttpType = 'HTTP'> implements Plugin<T> {
  private prefix: string;
  private routingTable: Route<T>[];

  public constructor(options?: Options) {
    this.prefix = options?.prefix || '';
    this.routingTable = [];
  }

  public getHandler(): Handler<T> {
    return (req) => {
      const method = req.getMethod();
      const pathname = req.getUrl().pathname;
      const route = this.routingTable.find((route) => {
        if (!route.method.includes(method)) return false;
        if (!route.pathname.test(pathname)) return false;
        return true;
      });
      if (!route?.handler) {
        return {
          code: 501,
          body: null,
        };
      }
      return route?.handler(req);
    };
  }

  public setRoute(
    method: string | string[],
    pathname: string | RegExp,
    handler: Handler<T>,
  ): void {
    const validMethod = this.getValidMethod(method);
    const validPathname = this.getValidPathname(pathname);
    const route = this.routingTable.find((route) => {
      if (route.method.toString() !== validMethod.toString()) return false;
      if (route.pathname.toString() !== validPathname.toString()) return false;
      return true;
    });
    if (route) {
      route.handler = handler;
    } else {
      this.routingTable.push({
        method: validMethod,
        pathname: validPathname,
        handler: handler,
      });
    }
  }

  private getValidMethod(method: string | string[]): string[] {
    const methodArray = (Array.isArray(method) ? method : [method]).map(
      (method) => method.toUpperCase(),
    );
    return validMethod.filter((method) => {
      if (methodArray.includes(method)) return true;
      return methodArray.includes('ALL');
    });
  }

  private getValidPathname(pathname: string | RegExp): RegExp {
    if (pathname instanceof RegExp) return pathname;
    const prefix = pathname.startsWith('/') ? '^' : '^/';
    const suffix = pathname.endsWith('/') ? '' : '/?$';
    return RegExp(prefix + pathname + suffix);
  }
}

export { Router as default };
