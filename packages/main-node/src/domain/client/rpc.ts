import { Client as ClientRaw } from '@dest-toolkit/grpc-client';
import { type EntitySchemaOptions } from 'typeorm';
import {
  ActionEnum,
  AgentDefinition,
  DatabaseDefinition,
  HierarchyDefinition,
  LevelEnum,
  TypeEnum,
  QueryDefinition,
} from '../../domain';
import {
  type Client,
  type ClientAction,
  type ClientEvent,
  type ClientHost,
  type ClientLevel,
  type ClientType,
} from './type';

class RpcClient implements Client {
  private raw: ClientRaw<
    AgentDefinition | DatabaseDefinition | HierarchyDefinition | QueryDefinition
  >;
  private secret: string;
  private token: string;

  constructor(host: ClientHost, token: string, secret?: string) {
    this.raw = new ClientRaw(
      [
        AgentDefinition,
        DatabaseDefinition,
        HierarchyDefinition,
        QueryDefinition,
      ],
      host,
    );
    this.token = token;
    this.secret = secret || '';
  }

  public deleteAgent() {
    return this.raw.call('deleteAgent')({
      secret: this.secret,
    });
  }

  public deleteDatabase(type: ClientType, name: string) {
    return this.raw.call('deleteDatabase')({
      secret: this.secret,
      type: this.getTypeEnum(type),
      name,
    });
  }

  public async getAgent() {
    const { success, token } = await this.raw.call('getAgent')({
      secret: this.secret,
    });
    return { success: success && token === this.token };
  }

  public async getDatabase(type: ClientType, name: string) {
    const { success, schemas } = await this.raw.call('getDatabase')({
      secret: this.secret,
      type: this.getTypeEnum(type),
      name,
    });
    return {
      success,
      schemas: schemas.map((schema) => JSON.parse(schema)),
    };
  }

  public async getHierarchy(
    type: ClientType | '',
    name: string,
    table: string,
    level: ClientLevel,
  ) {
    const { success, environments } = await this.raw.call('getHierarchy')({
      secret: this.secret,
      type: this.getTypeEnum(type),
      name,
      table,
      level: this.getLevelEnum(level),
    });
    return {
      success,
      environments: environments.map((environment) => ({
        type: this.getType(environment.type),
        databases: environment.databases.map((database) => ({
          ...database,
          snapshots: database.snapshots.map((snapshot) => ({
            ...snapshot,
            rows: snapshot.rows.map((row) => JSON.parse(row)),
          })),
        })),
      })),
    };
  }

  public postAgent() {
    return this.raw.call('postAgent')({
      secret: this.secret,
      token: this.token,
    });
  }

  public postDatabase(
    type: ClientType,
    name: string,
    schemas: EntitySchemaOptions<unknown>[],
  ) {
    return this.raw.call('postDatabase')({
      secret: this.secret,
      type: this.getTypeEnum(type),
      name,
      schemas: schemas.map((schema) => JSON.stringify(schema)),
    });
  }

  public async postQuery(
    type: ClientType,
    name: string,
    event: ClientEvent<unknown>,
  ) {
    const { success, result } = await this.raw.call('postQuery')({
      secret: this.secret,
      type: this.getTypeEnum(type),
      name,
      event: {
        action: this.getActionEnum(event.action),
        target: event.target,
        values: event.values.map((value) => JSON.stringify(value)),
      },
    });
    return {
      success,
      result: {
        time: result?.time || 0,
        error: result?.error || '',
        rows: result?.rows.map((row) => JSON.parse(row)) || [],
      },
    };
  }

  private getActionEnum(action: ClientAction): ActionEnum {
    if (action === 'save') return ActionEnum.SAVE;
    if (action === 'remove') return ActionEnum.REMOVE;
    if (action === 'read') return ActionEnum.READ;
    if (action === 'write') return ActionEnum.WRITE;
    if (action === 'root') return ActionEnum.ROOT;
    if (action === 'introspect') return ActionEnum.INTROSPECT;
    return ActionEnum.DEFAULT_ACTION;
  }

  private getLevelEnum(level: ClientLevel): LevelEnum {
    if (level === 'environment') return LevelEnum.ENVIRONMENT;
    if (level === 'database') return LevelEnum.DATABASE;
    if (level === 'table') return LevelEnum.TABLE;
    if (level === 'row') return LevelEnum.ROW;
    return LevelEnum.DEFAULT_LEVEL;
  }

  private getType(type: TypeEnum): ClientType | '' {
    if (type === TypeEnum.MARIADB) return 'mariadb';
    if (type === TypeEnum.MYSQL8) return 'mysql:8';
    if (type === TypeEnum.SQLITE) return 'sqlite';
    return '';
  }

  private getTypeEnum(type: ClientType | ''): TypeEnum {
    if (type === 'mariadb') return TypeEnum.MARIADB;
    if (type === 'mysql:8') return TypeEnum.MYSQL8;
    if (type === 'sqlite') return TypeEnum.SQLITE;
    return TypeEnum.DEFAULT_TYPE;
  }
}

export { RpcClient };
