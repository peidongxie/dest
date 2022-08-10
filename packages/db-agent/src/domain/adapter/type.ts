import { type DataSourceOptions } from 'typeorm';

type AdapterType = 'mariadb' | 'mysql:8';
type AdapterTypeAlias = 'mysql';

interface Adapter {
  type: AdapterType;
  getCreateQuery: (name: string) => string;
  getDestroyQuery: (name: string) => string;
  getWritableDataSourceOptions: (name: string) => DataSourceOptions;
}

export { type Adapter, type AdapterType, type AdapterTypeAlias };
