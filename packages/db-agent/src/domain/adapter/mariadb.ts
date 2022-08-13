import { DataSource, EntitySchema } from 'typeorm';
import { type Adapter } from './type';

class Mariadb implements Adapter {
  static root: DataSource;

  name: string;
  readable: DataSource;
  writable: DataSource;

  constructor(name: string, entities: EntitySchema[]) {
    this.name = name;
    if (name) {
      this.readable = new DataSource({
        type: 'mariadb',
        host: 'localhost',
        port: 3306,
        database: name,
        username: 'root',
        password: 'dest-toolkit',
        entities: entities,
        synchronize: true,
      });
      this.writable = new DataSource({
        type: 'mariadb',
        host: 'localhost',
        port: 3306,
        database: name,
        username: 'root',
        password: 'dest-toolkit',
        entities: entities,
        synchronize: true,
      });
    } else {
      Mariadb.root =
        Mariadb.root ||
        new DataSource({
          type: 'mariadb',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'dest-toolkit',
          synchronize: true,
        });
      this.readable = Mariadb.root;
      this.writable = Mariadb.root;
    }
  }

  getReadableDataSource() {
    return this.readable;
  }

  getRootDataSource() {
    return Mariadb.root;
  }

  getWritableDataSource() {
    return this.writable;
  }

  async postDestroy() {
    if (this.name) {
      await Mariadb.root.query(`DROP DATABASE IF EXISTS \`${this.name}\``);
    }
  }

  async preCreate() {
    if (this.name) {
      await Mariadb.root.query(
        `CREATE DATABASE IF NOT EXISTS \`${this.name}\``,
      );
    }
  }

  async postCreate() {
    if (!this.name) {
      const result: { Database: string }[] = await Mariadb.root.query(
        `SHOW DATABASES`,
      );
      const names = result
        .filter((row) => {
          return ![
            'information_schema',
            'mysql',
            'performance_schema',
            'sys',
          ].includes(row.Database);
        })
        .map((row) => row.Database);
      for (const name of names) {
        await Mariadb.root.query(`DROP DATABASE IF EXISTS \`${name}\``);
      }
    }
  }
}

export default Mariadb;
