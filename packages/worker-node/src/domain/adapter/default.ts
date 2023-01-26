import { type Adapter } from './type';

class Default implements Adapter {
  public getReadableDataSource() {
    return null;
  }

  public async getRows() {
    return null;
  }

  public async getTables() {
    return null;
  }

  public getWritableDataSource() {
    return null;
  }
}

export default Default;
