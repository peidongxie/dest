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
  type ContextAction,
  type ContextEvent,
  type ContextLevel,
  type ContextType,
} from '../context';
import { type Client } from './type';

class RpcClient implements Client {
  private raw: ClientRaw<
    AgentDefinition | DatabaseDefinition | HierarchyDefinition | QueryDefinition
  >;

  constructor(port: number, hostname: string) {
    this.raw = new ClientRaw(
      [
        AgentDefinition,
        DatabaseDefinition,
        HierarchyDefinition,
        QueryDefinition,
      ],
      {
        port,
        hostname,
      },
    );
  }

  public deleteAgent(secret: string) {
    return this.raw.call('deleteAgent')({
      secret,
    });
  }

  public deleteDatabase(type: ContextType, name: string) {
    return this.raw.call('deleteDatabase')({
      type: this.getTypeEnum(type),
      name,
    });
  }

  public getAgent(secret: string) {
    return this.raw.call('getAgent')({
      secret,
    });
  }

  public getDatabase(type: ContextType, name: string) {
    return this.raw.call('getDatabase')({
      type: this.getTypeEnum(type),
      name,
    });
  }

  public async getHierarchy(
    type: ContextType | '',
    name: string,
    table: string,
    level: ContextLevel,
  ) {
    const { success, environments } = await this.raw.call('getHierarchy')({
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

  public postAgent(secret: string) {
    return this.raw.call('postAgent')({
      secret,
    });
  }

  public postDatabase(
    type: ContextType,
    name: string,
    schemas: EntitySchemaOptions<unknown>[],
  ) {
    return this.raw.call('postDatabase')({
      type: this.getTypeEnum(type),
      name,
      schemas: schemas.map((schema) => JSON.stringify(schema)),
    });
  }

  public async postQuery(
    type: ContextType,
    name: string,
    event: ContextEvent<unknown>,
  ) {
    const { success, result } = await this.raw.call('postQuery')({
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

  private getActionEnum(action: ContextAction): ActionEnum {
    if (action === 'save') return ActionEnum.SAVE;
    if (action === 'remove') return ActionEnum.REMOVE;
    if (action === 'read') return ActionEnum.READ;
    if (action === 'write') return ActionEnum.WRITE;
    if (action === 'root') return ActionEnum.ROOT;
    if (action === 'introspect') return ActionEnum.INTROSPECT;
    return ActionEnum.DEFAULT_ACTION;
  }

  private getLevelEnum(level: ContextLevel): LevelEnum {
    if (level === 'environment') return LevelEnum.DATABASE;
    if (level === 'database') return LevelEnum.DATABASE;
    if (level === 'table') return LevelEnum.TABLE;
    if (level === 'row') return LevelEnum.ROW;
    return LevelEnum.DEFAULT_LEVEL;
  }

  private getType(type: TypeEnum): ContextType | '' {
    if (type === TypeEnum.MARIADB) return 'mariadb';
    if (type === TypeEnum.MYSQL8) return 'mysql:8';
    if (type === TypeEnum.SQLITE) return 'sqlite';
    return '';
  }

  private getTypeEnum(type: ContextType | ''): TypeEnum {
    if (type === 'mariadb') return TypeEnum.MARIADB;
    if (type === 'mysql:8') return TypeEnum.MYSQL8;
    if (type === 'sqlite') return TypeEnum.SQLITE;
    return TypeEnum.DEFAULT_TYPE;
  }
}

export { RpcClient };
