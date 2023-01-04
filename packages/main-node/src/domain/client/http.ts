import { Client, Router, type Route } from '@dest-toolkit/http-client';

class HttpClient {
  private raw: Client;

  constructor(routes: Route[], port: number, hostname: string) {
    const router = new Router({ host: 'localhost' });
    for (const route of routes) {
      router.setRoute({
        ...route,
        redirect: `${hostname}:${port}${route.redirect}`,
      });
    }
    this.raw = new Client();
    this.raw.use(router);
  }

  public call<T>(name: string): (req?: object) => Promise<T> {
    return async (req) => {
      const response = await this.raw.call({
        url: name,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: req || null,
      });
      return response.body.json();
    };
  }
}

export { HttpClient };
