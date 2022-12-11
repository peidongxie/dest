import { createDatabase, createServer } from './service';

// await createDatabase('mariadb', '', []);
await createDatabase('sqlite', '', []);
await createServer('http', 3001);
await createServer('rpc', 3002);
