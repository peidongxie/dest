import { type Handler } from './handler';
import { type ServerResponseHeaders } from './server';

interface Route {
  method: string[];
  pathname: RegExp;
  handler: Handler;
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

class RestfulRouter {
  private routingTable: Route[];

  public constructor() {
    this.routingTable = [];
  }

  public getExtraHeaders(): ServerResponseHeaders {
    return {};
  }

  public getHandler(method: string, pathname: string): Handler | null {
    const route = this.routingTable.find((route) => {
      if (!route.method.includes(method)) return false;
      if (!route.pathname.test(pathname)) return false;
      return true;
    });
    return route?.handler || null;
  }

  public setRoute(
    method: string | string[],
    pathname: string | RegExp,
    handler?: Handler,
  ): void {
    const validMethod = this.getValidMethod(method);
    const validPathname = this.getValidPathname(pathname);
    const validHandler = this.getValidHandler(handler);
    const route = this.routingTable.find((route) => {
      if (route.method.toString() !== validMethod.toString()) return false;
      if (route.pathname.toString() !== validPathname.toString()) return false;
      return true;
    });
    if (route) {
      route.handler = validHandler;
    } else {
      this.routingTable.push({
        method: validMethod,
        pathname: validPathname,
        handler: validHandler,
      });
    }
  }

  private getValidHandler(handler?: Handler): Handler {
    return (
      handler ||
      (() => {
        return;
      })
    );
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

export { RestfulRouter as default };
