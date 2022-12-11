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

class Server {
  static store: Map<number, Server> = new Map();

  private raw: HttpServer | RpcServer;

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
      return;
    }
    if (type === 'rpc') {
      this.raw = new RpcServer();
      this.raw.use(deleteDatabaseByRpc);
      this.raw.use(getDatabaseByRpc);
      this.raw.use(postDatabaseByRpc);
      this.raw.use(putDatabaseByRpc);
      this.raw.use(postQueryByRpc);
      return;
    }
    throw new TypeError('Invalid server type');
  }

  async close(): Promise<Server> {
    await this.raw.close();
    return this;
  }

  async listen(port: number, hostname?: string): Promise<Server> {
    Server.store.set(port, this);
    await this.raw.listen(port, hostname);
    return this;
  }
}

export { Server };
