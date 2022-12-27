import {
  Client as RpcClient,
  type ProtoDefinition,
  type RequestWrapped,
  type ResponseWrapped,
} from '@dest-toolkit/grpc-client';
import {
  Client as HttpClient,
  Router,
  type Route,
} from '@dest-toolkit/http-client';

class Client<API extends Route[] | ProtoDefinition> {
  public call: API extends ProtoDefinition
    ? <CallName extends keyof API['methods']>(
        name: CallName,
      ) => (
        req: RequestWrapped<API['methods'][CallName]>,
      ) => ResponseWrapped<API['methods'][CallName]>
    : (name: string) => (req?: object) => ReturnType<Response['json']>;
  private raw: API extends ProtoDefinition ? RpcClient<API> : HttpClient;

  constructor(api: API, port: number, hostname: string) {
    const routes = api as Route[];
    const definition = api as ProtoDefinition;
    if (
      routes.every?.(
        (route) =>
          Reflect.has(route, 'pathname') && Reflect.has(route, 'redirect'),
      )
    ) {
      const router = new Router({ host: 'localhost' });
      for (const route of routes) {
        router.setRoute({
          ...route,
          redirect: `${hostname}:${port}${route.redirect}`,
        });
      }
      this.raw = new HttpClient() as API extends ProtoDefinition
        ? RpcClient<API>
        : HttpClient;
      (this.raw as HttpClient).use(router);
      this.call = ((name: string) => (req?: object) =>
        (this.raw as HttpClient)
          .call({
            url: name,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
            body: req || null,
          })
          .then(({ body }) => body.json())) as typeof this['call'];
    } else if (
      Reflect.has(definition, 'fullName') &&
      Reflect.has(definition, 'methods') &&
      Reflect.has(definition, 'name')
    ) {
      this.raw = new RpcClient(definition, {
        port,
        hostname: hostname || 'localhost',
      }) as API extends ProtoDefinition ? RpcClient<API> : HttpClient;
      this.call = (<CallName extends keyof ProtoDefinition['methods']>(
          name: CallName,
        ) =>
        (req: RequestWrapped<ProtoDefinition['methods'][CallName]>) =>
          (this.raw as RpcClient<ProtoDefinition>).call(name)(
            req,
          )) as typeof this['call'];
    } else {
      throw new TypeError('Invalid client api');
    }
  }
}

export { Client };
