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
    : (name: string) => (req: object) => ReturnType<Response['json']>;
  private raw: API extends ProtoDefinition ? RpcClient<API> : HttpClient;

  constructor(api: API, port: number, hostname?: string) {
    const routes = api as Route[];
    const definition = api as ProtoDefinition;
    if (
      routes.every?.(
        (route) =>
          Reflect.has(route, 'pathname') && Reflect.has(route, 'redirect'),
      )
    ) {
      const host = `${hostname || 'localhost'}:${port}`;
      const router = new Router({ host });
      for (const route of routes) {
        router.setRoute(route);
      }
      const client = new HttpClient({ defaultUrl: `http://${host}/` });
      client.use(router);
      this.call = ((name: string) => (req: object) =>
        client
          .call({
            url: name,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
            body: req,
          })
          .then(({ body }) => body.json())) as typeof this['call'];
      this.raw = client as API extends ProtoDefinition
        ? RpcClient<API>
        : HttpClient;
    } else if (
      Reflect.has(definition, 'fullName') &&
      Reflect.has(definition, 'methods') &&
      Reflect.has(definition, 'name')
    ) {
      const client = new RpcClient(definition, {
        port,
        hostname: hostname || 'localhost',
      });
      this.call = (<CallName extends keyof ProtoDefinition['methods']>(
          name: CallName,
        ) =>
        (req: RequestWrapped<ProtoDefinition['methods'][CallName]>) =>
          client.call(name)(req)) as typeof this['call'];
      this.raw = client as API extends ProtoDefinition
        ? RpcClient<API>
        : HttpClient;
    } else {
      throw new TypeError('Invalid client api');
    }
  }
}

export { Client };
