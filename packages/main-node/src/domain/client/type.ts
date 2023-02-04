import { type EntitySchemaOptions } from 'typeorm';

interface ClientHost {
  hostname: string;
  port: number;
}

type ClientType = 'mariadb' | 'mysql8' | 'sqlite';

type ClientLevel = 'environment' | 'database' | 'table' | 'row';

interface ClientSnapshot {
  table: string;
  rows: unknown[];
}

interface ClientDatabase {
  name: string;
  snapshots: ClientSnapshot[];
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
  type ClientSnapshot,
  type ClientType,
};
