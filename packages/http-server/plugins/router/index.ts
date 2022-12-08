import { type Plugin, type PluginHandler } from '../../server';

interface Route {
  method: string | string[];
  pathname: string;
  handler: PluginHandler;
}

interface PluginRoute {
  method: string[];
  pathname: RegExp;
  handler: PluginHandler;
}

interface PluginOptions {
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

class Router implements Plugin {
  private prefix: string;
  private routes: PluginRoute[];

  public constructor(options?: PluginOptions) {
    this.prefix = (options?.prefix || '').trim();
    this.routes = [];
  }

  public getHandler(): PluginHandler {
    return (req) => {
      const { method, url } = req;
      const pathname = `/${url.pathname}/`.replace(/\/+/g, '/');
      const route = this.routes.find((route) => {
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

  public setPrefix(prefix: string): void {
    this.prefix = (prefix || '').trim();
  }

  public setRoute({ method, pathname, handler }: Route): void {
    const validMethod = this.getValidMethod(method);
    const validPathname = this.getValidPathname(pathname);
    const route = this.routes.find((route) => {
      if (route.method.toString() !== validMethod.toString()) return false;
      if (route.pathname.toString() !== validPathname.toString()) return false;
      return true;
    });
    if (route) {
      route.handler = handler;
    } else {
      this.routes.push({
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

  private getValidPathname(pathname: string): RegExp {
    const fullPathname = `/${this.prefix}${pathname}/`.replace(/\/+/g, '/');
    return RegExp('^' + fullPathname.replace(/\[.*\]/g, '[^/]+'));
  }
}

export { Router as default, type Route };
