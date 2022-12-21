import {
  type Plugin,
  type PluginHandler,
  type RequestWrapped,
} from '../../client';

interface PluginOptions {
  nameSymbol?: symbol;
  dataSymbol?: symbol;
  handlerSymbol?: symbol;
}

interface Route<T> {
  name: string;
  handler: (
    req: RequestWrapped,
    data: T,
  ) => RequestWrapped | Promise<RequestWrapped>;
}

class Router implements Plugin {
  private dataSymbol: symbol;
  private nameSymbol: symbol;
  private routes: Map<string, PluginHandler<RequestWrapped>>;

  public constructor(options?: PluginOptions) {
    this.dataSymbol = options?.dataSymbol || Symbol();
    this.nameSymbol = options?.nameSymbol || Symbol();
    this.routes = new Map();
  }

  public getDataSymbol(): symbol {
    return this.dataSymbol;
  }

  public getNameSymbol(): symbol {
    return this.nameSymbol;
  }

  public getReqHandler(): PluginHandler<RequestWrapped> {
    return (req) => {
      const name = req[this.nameSymbol];
      const handler = this.routes.get(name as string);
      if (!handler) return req;
      return handler(req);
    };
  }

  public setRoute<T>({ name, handler }: Route<T>): void {
    this.routes.set(name, (req) => handler(req, req[this.dataSymbol] as T));
  }
}

export { Router as default, type Route };
