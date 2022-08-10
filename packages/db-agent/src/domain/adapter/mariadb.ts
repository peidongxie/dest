import { type Adapter } from './type';

const mariadb: Adapter = {
  type: 'mariadb',
  getCreateQuery: (name) => `CREATE DATABASE IF NOT EXISTS \`${name}\``,
  getDestroyQuery: (name) => `DROP DATABASE IF EXISTS \`${name}\``,
  getWritableDataSourceOptions: (name) => ({
    type: 'mariadb',
    host: 'localhost',
    port: 3306,
    database: name,
    username: 'root',
    password: 'dest-toolkit',
    synchronize: true,
  }),
};

export default mariadb;
