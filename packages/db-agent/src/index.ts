import { Cors, Router, Server } from '@dest/http-server';

const cors = new Cors();

const router = new Router();
router.setRoute('all', '/hello', () => {
  return {
    body: 'Hello, World!',
  };
});

const server = new Server('http');
server.use(cors.getHandler());
server.use(router.getHandler());
server.listen(3001);
