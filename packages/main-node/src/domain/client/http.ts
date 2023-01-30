import { Client as ClientRaw, Router } from '@dest-toolkit/http-client';
import { type EntitySchemaOptions } from 'typeorm';
import { ActionEnum, LevelEnum, TypeEnum } from '../../domain';
import {
  type Client,
  type ClientAction,
  type ClientDatabase,
  type ClientEvent,
  type ClientLevel,
  type ClientResult,
  type ClientType,
} from './type';

class HttpClient implements Client {
  private raw: ClientRaw;

  constructor(port: number, hostname: string) {
    const router = new Router({ host: 'localhost' });
    router.setRoute({
      pathname: 'deleteAgent',
      redirect: `${hostname}:${port}/agent`,
      method: 'DELETE',
    });
    router.setRoute({
      pathname: 'deleteDatabase',
      redirect: `${hostname}:${port}/database`,
      method: 'DELETE',
    });
    router.setRoute({
      pathname: 'getAgent',
      redirect: `${hostname}:${port}/agent`,
      method: 'GET',
    });
    router.setRoute({
      pathname: 'getDatabase',
      redirect: `${hostname}:${port}/database`,
      method: 'GET',
    });
    router.setRoute({
      pathname: 'getHierarchy',
      redirect: `${hostname}:${port}/hierarchy`,
      method: 'GET',
    });
    router.setRoute({
      pathname: 'postAgent',
      redirect: `${hostname}:${port}/agent`,
      method: 'POST',
    });
    router.setRoute({
      pathname: 'postDatabase',
      redirect: `${hostname}:${port}/database`,
      method: 'POST',
    });
    router.setRoute({
      pathname: 'postQuery',
      redirect: `${hostname}:${port}/query`,
      method: 'POST',
    });
    this.raw = new ClientRaw();
    this.raw.use(router);
  }

  public deleteAgent(secret: string) {
    return this.call<{
      success: boolean;
      token: string;
    }>(`deleteAgent?secret=${secret}`)();
  }

  public deleteDatabase(type: ClientType, name: string) {
    return this.call<{
      success: boolean;
    }>(`deleteDatabase?type=${this.getTypeEnum(type)}&name=${name}`)();
  }

  public getAgent(secret: string) {
    return this.call<{
      success: boolean;
      token: string;
    }>(`getAgent?secret=${secret}`)();
  }

  public getDatabase(type: ClientType, name: string) {
    return this.call<{
      success: boolean;
    }>(`getDatabase?type=${this.getTypeEnum(type)}&name=${name}`)();
  }

  public postAgent(secret: string) {
    return this.call<{
      success: boolean;
      token: string;
    }>(`postAgent?secret=${secret}`)();
  }

  public async getHierarchy(
    type: ClientType | '',
    name: string,
    table: string,
    level: ClientLevel,
  ) {
    const { success, environments } = await this.call<{
      success: boolean;
      environments: { type: TypeEnum; databases: ClientDatabase[] }[];
    }>(
      `getHierarchy?type=${
        this.getTypeEnum(type) || ''
      }&name=${name}&table=${table}&level=${this.getLevelEnum(level)}`,
    )();
    return {
      success,
      environments: environments.map((environment) => ({
        type: this.getType(environment.type),
        databases: environment.databases,
      })),
    };
  }

  public postDatabase(
    type: ClientType,
    name: string,
    schemas: EntitySchemaOptions<unknown>[],
  ) {
    return this.call<{
      success: boolean;
    }>(`postDatabase?type=${this.getTypeEnum(type)}&name=${name}`)(schemas);
  }

  public postQuery<T>(
    type: ClientType,
    name: string,
    event: ClientEvent<unknown>,
  ) {
    return this.call<{
      success: boolean;
      result: ClientResult<T>;
    }>(`postQuery?type=${this.getTypeEnum(type)}&name=${name}`)({
      ...event,
      action: this.getActionEnum(event.action),
    });
  }

  private call<T>(name: string): (req?: object) => Promise<T> {
    return async (req) => {
      const response = await this.raw.call({
        url: name,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: req || null,
      });
      return response.body.json();
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
    if (level === 'environment') return LevelEnum.DATABASE;
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

export { HttpClient };
