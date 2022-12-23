import { URL } from 'url';
import {
  type Plugin,
  type PluginHandler,
  type RequestWrapped,
} from '../../client';

interface PluginOptions {
  host?: string;
}

interface UrlLike {
  protocol: string;
  host: string;
  pathname: string;
  searchParams: URLSearchParams;
}

interface PluginRoute {
  pathname: RegExp;
  redirect: UrlLike;
  method: string;
}

interface Route {
  pathname: string;
  redirect: string;
  method?: string;
}

class Router implements Plugin {
  private host: string;
  private routes: PluginRoute[];

  public constructor(options?: PluginOptions) {
    this.host = options?.host || 'localhost';
    this.routes = [];
  }

  public getReqHandler(): PluginHandler<Required<RequestWrapped>> {
    return (req) => {
      const url = new URL(req.url.toString());
      const host = url.host;
      const pathname = `/${url.pathname}/`.replace(/\/+/g, '/');
      if (this.host !== host) return req;
      const route = this.routes.find((route) => route.pathname.test(pathname));
      if (!route) return req;
      url.protocol = route.redirect.protocol || url.protocol;
      url.host = route.redirect.host;
      url.pathname = route.redirect.pathname;
      for (const [key, value] of route.redirect.searchParams) {
        url.searchParams.append(key, value);
      }
      return {
        method: route.method || req.method,
        url: url,
        headers: req.headers,
        body: req.body,
      };
    };
  }

  public setRoute({ pathname, redirect, method }: Route): void {
    this.routes.push({
      pathname: RegExp(`^/${pathname}/`.replace(/\/+/g, '/')),
      method: method || '',
      redirect: this.parseUrlLike(redirect),
    });
  }

  private parseUrlLike(urlLike: string): UrlLike {
    if (!urlLike.includes(':')) {
      return {
        ...this.parseUrlLike('http://' + urlLike),
        protocol: '',
      };
    }
    const url = new URL(urlLike);
    return {
      protocol: url.protocol,
      host: url.host,
      pathname: url.pathname,
      searchParams: url.searchParams,
    };
  }
}

export { Router as default, type Route };
