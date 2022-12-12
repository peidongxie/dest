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
import { TaskRunner } from '../task-runner';

enum ServerState {
  INITIALIZED,
  RUNNING,
  TERMINATED,
}

class Server extends TaskRunner {
  private raw: HttpServer | RpcServer;

  constructor(type: 'http' | 'rpc') {
    super(ServerState.INITIALIZED);
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
