import { Cors, Router, Server } from '@dest-toolkit/http-server';
import {
  deleteDatabase,
  getDatabase,
  postDatabase,
  postQuery,
  putDatabase,
} from './controller';
import { createDatabase } from './service';

const createInitialDatabase = async () => {
  // await createDatabase('mariadb', '', []);
  await createDatabase('sqlite', '', []);
};

const startServer = async () => {
  const cors = new Cors();
  const router = new Router();
  router.setRoute('DELETE', '/database', deleteDatabase);
  router.setRoute('GET', '/database', getDatabase);
  router.setRoute('POST', '/database', postDatabase);
  router.setRoute('PUT', '/database', putDatabase);
  router.setRoute('POST', '/query', postQuery);
  const server = new Server<'HTTP'>('http');
  server.use(cors.getHandler());
  server.use(router.getHandler());
  server.listen(3001);
};

await createInitialDatabase();
await startServer();
