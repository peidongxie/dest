import { DataSource, EntitySchema } from 'typeorm';
import { type Adapter } from './type';

class Mysql8 implements Adapter {
  static root: DataSource;

  name: string;
  readable: DataSource;
  writable: DataSource;

  constructor(name: string, entities: EntitySchema[]) {
    this.name = name;
    if (name) {
      this.readable = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3307,
        database: name,
        username: 'root',
        password: 'dest-toolkit',
        entities: entities,
        synchronize: true,
      });
      this.writable = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3307,
        database: name,
        username: 'root',
        password: 'dest-toolkit',
        entities: entities,
        synchronize: true,
      });
    } else {
      Mysql8.root =
        Mysql8.root ||
        new DataSource({
          type: 'mysql',
          host: 'localhost',
          port: 3307,
          username: 'root',
          password: 'dest-toolkit',
          synchronize: true,
        });
      this.readable = Mysql8.root;
      this.writable = Mysql8.root;
    }
  }

  getReadableDataSource() {
    return this.readable;
  }

  getRootDataSource() {
    return Mysql8.root;
  }

  getWritableDataSource() {
    return this.writable;
  }

  async postDestroy() {
    if (this.name) {
      await Mysql8.root.query(`DROP DATABASE IF EXISTS \`${this.name}\``);
    }
  }

  async preCreate() {
    if (this.name) {
      await Mysql8.root.query(`CREATE DATABASE IF NOT EXISTS \`${this.name}\``);
    }
  }

  async postCreate() {
    if (!this.name) {
      const result: { Database: string }[] = await Mysql8.root.query(
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
        await Mysql8.root.query(`DROP DATABASE IF EXISTS \`${name}\``);
      }
    }
  }
}

export default Mysql8;
