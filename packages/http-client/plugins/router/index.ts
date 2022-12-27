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
  pathname: string;
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
      const actualMethod = req.method;
      const actualProtocol = url.protocol;
      const actualHost = url.host;
      const actualPathname = `/${url.pathname}/`.replace(/\/+/g, '/');
      const actualSearch = url.search;
      const expectedHost = this.host;
      if (expectedHost !== actualHost) return req;
      const route = this.routes.find((route) => {
        const expectedPathname = route.pathname;
        return actualPathname.startsWith(expectedPathname);
      });
      if (!route) return req;
      const expectedPathname = route.pathname;
      const targetMethod = route.method;
      const targetProtocol = route.redirect.protocol;
      const targetHost = route.redirect.host;
      const targetPathname = route.redirect.pathname;
      const targetSearch = route.redirect.search;
      url.protocol = targetProtocol || actualProtocol;
      url.host = targetHost;
      url.pathname =
        targetPathname + actualPathname.substring(expectedPathname.length);
      url.search = this.mergeSearch(targetSearch, actualSearch);
      this.resolveDynamicPathname(url);
      return {
        method: targetMethod || actualMethod,
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
      pathname: `/${pathname}/`.replace(/\/+/g, '/'),
      method: method || '',
      redirect: {
        ...urlLike,
        pathname: `/${urlLike.pathname}/`.replace(/\/+/g, '/'),
      },
    });
  }

  private mergeSearch(...searchList: string[]): string {
    const searchParams = new URLSearchParams();
    for (const search of searchList) {
      for (const [name, value] of new URLSearchParams(search)) {
        searchParams.append(name, value);
      }
    }
    return searchParams.toString();
  }

  private parseUrlLike(urlLike: string): UrlLike {
    if (!urlLike.includes('://')) {
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
