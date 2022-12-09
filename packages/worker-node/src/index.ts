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
} from './controller';
import { createDatabase } from './service';

const createInitialDatabase = async () => {
  // await createDatabase('mariadb', '', []);
  await createDatabase('sqlite', '', []);
};

const startServer = async () => {
  const cors = new Cors();
  const router = new Router();
  router.setRoute(deleteDatabaseByHttp);
  router.setRoute(getDatabaseByHttp);
  router.setRoute(postDatabaseByHttp);
  router.setRoute(putDatabaseByHttp);
  router.setRoute(postQueryByHttp);
  const httpServer = new HttpServer('http');
  httpServer.use(cors.getHandler());
  httpServer.use(router.getHandler());
  httpServer.listen(3001);

  const rpcServer = new RpcServer();
  rpcServer.use(deleteDatabaseByRpc);
  rpcServer.use(getDatabaseByRpc);
  rpcServer.use(postDatabaseByRpc);
  rpcServer.use(putDatabaseByRpc);
  rpcServer.use(postQueryByRpc);
  rpcServer.listen(3002);
};

await createInitialDatabase();
await startServer();
