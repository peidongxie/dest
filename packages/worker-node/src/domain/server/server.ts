import {
  Server as RpcServer,
  type Plugin,
  type ProtoDefinition,
} from '@dest-toolkit/grpc-server';
import {
  Cors,
  Router,
  Server as HttpServer,
  type Route,
} from '@dest-toolkit/http-server';
import { TaskRunner } from '../task-runner';

enum ServerState {
  INITIALIZED,
  RUNNING,
  TERMINATED,
}

class Server extends TaskRunner {
  private raw: HttpServer | RpcServer;

  constructor(api: Route[] | Plugin<ProtoDefinition>[]) {
    super(ServerState.INITIALIZED);
    const routes = api as Route[];
    const plugins = api as Plugin<ProtoDefinition>[];
    if (
      routes.every?.(
        (route) =>
          Reflect.has(route, 'handler') &&
          Reflect.has(route, 'method') &&
          Reflect.has(route, 'pathname'),
      )
    ) {
      const cors = new Cors();
      const router = new Router();
      for (const route of routes) {
        router.setRoute(route);
      }
      this.raw = new HttpServer('http');
      this.raw.use(cors.getHandler());
      this.raw.use(router.getHandler());
    } else if (
      plugins.every?.(
        (plugin) =>
          Reflect.has(plugin, 'definition') && Reflect.has(plugin, 'handlers'),
      )
    ) {
      this.raw = new RpcServer();
      for (const plugin of plugins) {
        this.raw.use(plugin);
      }
    } else {
      throw new TypeError('Invalid server api');
    }
  }

  public async close(): Promise<this> {
    return this.runTask(
      (state) =>
        state === ServerState.RUNNING ? ServerState.TERMINATED : null,
      async () => {
        await this.raw.close();
        return this;
      },
    );
  }

  public async listen(port: number, hostname?: string): Promise<this> {
    return this.runTask(
      (state) =>
        state === ServerState.INITIALIZED ? ServerState.RUNNING : null,
      async () => {
        await this.raw.listen(port, hostname);
        return this;
      },
    );
  }
}

export { Server };
