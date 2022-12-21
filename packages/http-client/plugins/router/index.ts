import {
  type Plugin,
  type PluginHandler,
  type RequestWrapped,
  type ResponseWrapped,
} from '../../client';

interface PluginOptions {
  nameSymbol?: symbol;
  reqSymbol?: symbol;
  resSymbol?: symbol;
}

interface Route<ReqData, ResData> {
  name: string;
  reqHandler?: (
    req: RequestWrapped,
    data: ReqData,
  ) => RequestWrapped | Promise<RequestWrapped>;
  resHandler?: (
    res: ResponseWrapped,
    data: ResData,
  ) => ResponseWrapped | Promise<ResponseWrapped>;
}

interface PluginRoute {
  reqHandler: PluginHandler<RequestWrapped> | null;
  resHandler: PluginHandler<ResponseWrapped> | null;
}

class Router implements Plugin {
  private nameSymbol: symbol;
  private routes: Map<string, PluginRoute>;
  private reqSymbol: symbol;
  private resSymbol: symbol;

  public constructor(options?: PluginOptions) {
    this.nameSymbol = options?.nameSymbol || Symbol();
    this.reqSymbol = options?.reqSymbol || Symbol();
    this.resSymbol = options?.resSymbol || Symbol();
    this.routes = new Map();
  }

  public getDataSymbol(): symbol {
    return this.reqSymbol;
  }

  public getNameSymbol(): symbol {
    return this.nameSymbol;
  }

  public getReqHandler(): PluginHandler<RequestWrapped> {
    return (req) => {
      const name = req[this.nameSymbol];
      const handler = this.routes.get(name as string)?.reqHandler;
      if (!handler) return req;
      return handler(req);
    };
  }

  public getResHandler(): PluginHandler<ResponseWrapped> {
    return (res) => {
      const name = res[this.nameSymbol];
      const handler = this.routes.get(name as string)?.resHandler;
      if (!handler) return res;
      return handler(res);
    };
  }

  public setRoute<ReqData, ResData>({
    name,
    reqHandler,
    resHandler,
  }: Route<ReqData, ResData>): void {
    this.routes.set(name, {
      reqHandler: reqHandler
        ? (req) => reqHandler(req, req[this.reqSymbol] as ReqData)
        : null,
      resHandler: resHandler
        ? (res) => resHandler(res, res[this.resSymbol] as ResData)
        : null,
    });
  }
}

export { Router as default, type Route };
