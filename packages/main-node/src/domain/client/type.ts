import { type EntitySchemaOptions } from 'typeorm';

interface ClientHost {
  hostname: string;
  port: number;
}

interface ClientSetup extends ClientHost {
  api: 'http' | 'rpc';
}

type ClientType = 'mariadb' | 'mssql' | 'mysql57' | 'mysql8' | 'sqlite';

type ClientLevel = 'environment' | 'database' | 'table' | 'row';

interface ClientSnapshot<T> {
  table: string;
  rows: T[];
}

interface ClientDatabase {
  name: string;
  snapshots: ClientSnapshot<unknown>[];
}

interface ClientEnvironment {
  type: ClientType | '';
  databases: ClientDatabase[];
}

type ClientAction =
  | 'save'
  | 'remove'
  | 'read'
  | 'write'
  | 'root'
  | 'introspect';

interface ClientEvent<T> {
  action: ClientAction;
  target: string;
  values: T[];
}

interface ClientResult<T> {
  time: number;
  error: string;
  rows: T[];
}

interface Client {
  deleteAgent: () => Promise<{
    success: boolean;
  }>;
  deleteDatabase: (
    type: ClientType,
    name: string,
  ) => Promise<{
    success: boolean;
  }>;
  getAgent: () => Promise<{
    success: boolean;
  }>;
  getDatabase: (
    type: ClientType,
    name: string,
  ) => Promise<{
    success: boolean;
    schemas: EntitySchemaOptions<unknown>[];
  }>;
  getHierarchy: (
    type: ClientType | '',
    name: string,
    table: string,
    level: ClientLevel,
  ) => Promise<{
    success: boolean;
    environments: ClientEnvironment[];
  }>;
  getSetup: () => ClientSetup;
  postAgent: () => Promise<{
    success: boolean;
  }>;
  postDatabase: (
    type: ClientType,
    name: string,
    schemas: EntitySchemaOptions<unknown>[],
  ) => Promise<{
    success: boolean;
  }>;
  postQuery: <T>(
    type: ClientType,
    name: string,
    event: ClientEvent<unknown>,
  ) => Promise<{
    success: boolean;
    result: ClientResult<T>;
  }>;
}

export {
  type Client,
  type ClientAction,
  type ClientDatabase,
  type ClientEnvironment,
  type ClientEvent,
  type ClientHost,
  type ClientLevel,
  type ClientResult,
  type ClientSetup,
  type ClientSnapshot,
  type ClientType,
};
