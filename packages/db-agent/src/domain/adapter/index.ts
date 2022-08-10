import { type Adapter, type AdapterType, type AdapterTypeAlias } from './type';
import mariadb from './mariadb';
import mysql8 from './mysql8';

const adapterMapper: Record<AdapterType | AdapterTypeAlias, AdapterType> = {
  mariadb: 'mariadb',
  mysql: 'mysql:8',
  'mysql:8': 'mysql:8',
};

const createAdapter = (type: AdapterType | AdapterTypeAlias): Adapter => {
  switch (adapterMapper[type]) {
    case 'mariadb':
      return mariadb;
    case 'mysql:8':
      return mysql8;
  }
};

export {
  adapterMapper,
  createAdapter,
  type Adapter,
  type AdapterType,
  type AdapterTypeAlias,
};
