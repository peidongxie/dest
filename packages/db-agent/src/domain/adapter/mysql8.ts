import { type Adapter } from './type';

const mysql8: Adapter = {
  type: 'mysql:8',
  getCreateQuery: (name) => `CREATE DATABASE IF NOT EXISTS \`${name}\``,
  getDestroyQuery: (name) => `DROP DATABASE IF EXISTS \`${name}\``,
  getWritableDataSourceOptions: (name) => ({
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    database: name,
    username: 'root',
    password: 'dest-toolkit',
    synchronize: true,
  }),
};

export default mysql8;
