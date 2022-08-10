import { Cors, Router, Server } from '@dest-toolkit/http-server';
import { createDatabase, deleteDatabase, retrieveDatabase } from './service';

const cors = new Cors();

const router = new Router();
router.setRoute('POST', '/database', createDatabase);
router.setRoute('DELETE', '/database', deleteDatabase);
router.setRoute('GET', '/database', retrieveDatabase);

const server = new Server('http');
server.use(cors.getHandler());
server.use(router.getHandler());
server.listen(3001);
