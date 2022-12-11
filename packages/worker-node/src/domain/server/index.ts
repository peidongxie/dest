import { Server as RpcServer } from '@dest-toolkit/grpc-server';
import { Cors, Router, Server as HttpServer } from '@dest-toolkit/http-server';
import {
  deleteDatabaseByHttp,
  deleteDatabaseByRpc,
  getDatabaseByHttp,
  getDatabaseByRpc,
  postDatabaseByHttp,
  postDatabaseByRpc,
  postQueryByHttp,
  postQueryByRpc,
  putDatabaseByHttp,
  putDatabaseByRpc,
} from '../../controller';

enum ServerState {
  INITIALIZED = 0,
  RUNNING = 1,
  TERMINATED = 2,
}

class Server {
  private raw: HttpServer | RpcServer;
  private state: ServerState;
  private tasks: (() => Promise<void>)[];

  constructor(type: 'http' | 'rpc') {
    if (type === 'http') {
      const cors = new Cors();
      const router = new Router();
      router.setRoute(deleteDatabaseByHttp);
      router.setRoute(getDatabaseByHttp);
      router.setRoute(postDatabaseByHttp);
      router.setRoute(putDatabaseByHttp);
      router.setRoute(postQueryByHttp);
      this.raw = new HttpServer('http');
      this.raw.use(cors.getHandler());
      this.raw.use(router.getHandler());
    } else if (type === 'rpc') {
      this.raw = new RpcServer();
      this.raw.use(deleteDatabaseByRpc);
      this.raw.use(getDatabaseByRpc);
      this.raw.use(postDatabaseByRpc);
      this.raw.use(putDatabaseByRpc);
      this.raw.use(postQueryByRpc);
    } else {
      throw new TypeError('Invalid server type');
    }
    this.state = ServerState.INITIALIZED;
    this.tasks = [];
  }

  private runTask<T>(
    stateTransition: (state: ServerState) => ServerState | null,
    sideEffect: () => Promise<T>,
  ): Promise<T> {
    const state = stateTransition(this.state);
    if (state === null) return Promise.reject(new TypeError(''));
    const promise = new Promise<T>((resolve, reject) => {
      this.state = state;
      this.tasks.push(async () => {
        try {
          const result = await sideEffect();
          this.tasks.pop();
          if (this.tasks.length > 0) {
            this.tasks[0]();
          }
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
    if (this.tasks.length === 1) {
      this.tasks[0]();
    }
    return promise;
  }

  async close(): Promise<this> {
    return this.runTask(
      (state) =>
        state === ServerState.RUNNING ? ServerState.TERMINATED : null,
      async () => {
        await this.raw.close();
        return this;
      },
    );
  }

  async listen(port: number, hostname?: string): Promise<this> {
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
