import { type Adapter } from './type';

class Default implements Adapter {
  public async fetchRows() {
    return null;
  }

  public async fetchTables() {
    return null;
  }
  public getReadableDataSource() {
    return null;
  }

  public getWritableDataSource() {
    return null;
  }
}

export { Default };
