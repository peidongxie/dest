import { Client as ClientRaw } from '@dest-toolkit/grpc-client';
import { type EntitySchemaOptions } from 'typeorm';
import {
  AgentDefinition,
  BaseType,
  DatabaseDefinition,
  EventAction,
  QueryDefinition,
} from '../../domain';
import {
  type ContextAction,
  type ContextEventItem,
  type ContextType,
} from '../context';
import { type Client } from './type';

class RpcClient implements Client {
  private raw: ClientRaw<
    AgentDefinition | DatabaseDefinition | QueryDefinition
  >;

  constructor(port: number, hostname: string) {
    this.raw = new ClientRaw(
      [AgentDefinition, DatabaseDefinition, QueryDefinition],
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
      type: this.getType(type),
      name,
    });
  }

  public getAgent(secret: string) {
    return this.raw.call('getAgent')({
      secret,
    });
  }

  public async getDatabase(type: ContextType, name: string) {
    const { success, results } = await this.raw.call('getDatabase')({
      type: this.getType(type),
      name,
    });
    return {
      success,
      results: results.map((result) => ({
        ...result,
        rows: result.rows.map((row) => JSON.parse(row)),
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
      type: this.getType(type),
      name,
      schemas: schemas.map((schema) => JSON.stringify(schema)),
    });
  }

  public async postQuery(
    type: ContextType,
    name: string,
    event: ContextEventItem<unknown>,
  ) {
    const { success, result } = await this.raw.call('postQuery')({
      type: this.getType(type),
      name,
      event: {
        action: this.getAction(event.action),
        target: event.target,
        values: event.values.map((value) => JSON.stringify(value)),
      },
    });
    return {
      success,
      result: {
        time: result?.time || 0,
        table: result?.table || '',
        rows: result?.rows.map((row) => JSON.parse(row)) || [],
      },
    };
  }

  private getAction(action: ContextAction): EventAction {
    if (action === 'save') return EventAction.SAVE;
    if (action === 'remove') return EventAction.REMOVE;
    if (action === 'read') return EventAction.READ;
    if (action === 'write') return EventAction.WRITE;
    if (action === 'root') return EventAction.ROOT;
    return EventAction.DEFAULT_ACTION;
  }

  private getType(type: ContextType): BaseType {
    if (type === 'mariadb') return BaseType.MARIADB;
    if (type === 'mysql:8') return BaseType.MYSQL8;
    if (type === 'sqlite') return BaseType.SQLITE;
    return BaseType.DEFAULT_TYPE;
  }
}

export { RpcClient };
