import { URL, URLSearchParams } from 'url';
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
  search: string;
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
      const { method, redirect } = route;
      url.protocol = redirect.protocol || url.protocol;
      url.host = redirect.host;
      url.pathname = redirect.pathname;
      for (const [name, value] of new URLSearchParams(redirect.search)) {
        url.searchParams.append(name, value);
      }
      this.resolveDynamicPathname(url);
      return {
        method: method || req.method,
        url: url,
        headers: req.headers,
        body: req.body,
      };
    };
  }

  public setRoute({ pathname, redirect, method }: Route): void {
    const urlLike = this.parseUrlLike(redirect);
    this.resolveDynamicPathname(urlLike);
    this.routes.push({
      pathname: RegExp(`^/${pathname}/`.replace(/\/+/g, '/')),
      method: method || '',
      redirect: urlLike,
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
      search: url.search,
    };
  }

  private resolveDynamicPathname(urlLike: UrlLike): void {
    let pathname = urlLike.pathname;
    const searchParams = new URLSearchParams();
    for (const [name, value] of new URLSearchParams(urlLike.search)) {
      if (pathname.includes(`[${name}]`)) {
        pathname = pathname.replaceAll(`[${name}]`, value);
      } else {
        searchParams.append(name, value);
      }
    }
    urlLike.pathname = pathname;
    urlLike.search = searchParams.toString();
  }
}

export { Router as default, type Route };
