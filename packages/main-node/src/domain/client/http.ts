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
  type ClientSetup,
  type ClientType,
} from './type';

class HttpClient implements Client {
  private raw: ClientRaw;
  private token: string;

  constructor(token: string, setup: ClientSetup) {
    const router = new Router({ host: 'localhost' });
    const host = `${setup.hostname}:${setup.port}`;
    router.setRoute({
      pathname: 'deleteAgent',
      redirect: host + '/agent',
      method: 'DELETE',
    });
    router.setRoute({
      pathname: 'deleteDatabase',
      redirect: host + '/database',
      method: 'DELETE',
    });
    router.setRoute({
      pathname: 'getAgent',
      redirect: host + '/agent',
      method: 'GET',
    });
    router.setRoute({
      pathname: 'getDatabase',
      redirect: host + '/database',
      method: 'GET',
    });
    router.setRoute({
      pathname: 'getHierarchy',
      redirect: host + '/hierarchy',
      method: 'GET',
    });
    router.setRoute({
      pathname: 'postAgent',
      redirect: host + '/agent',
      method: 'POST',
    });
    router.setRoute({
      pathname: 'postDatabase',
      redirect: host + '/database',
      method: 'POST',
    });
    router.setRoute({
      pathname: 'postQuery',
      redirect: host + '/query',
      method: 'POST',
    });
    this.raw = new ClientRaw();
    this.raw.use(router);
    this.token = token;
  }

  public deleteAgent(secret: string) {
    return this.call<{
      success: boolean;
    }>(`deleteAgent?secret=${secret}`)();
  }

  public deleteDatabase(type: ClientType, name: string) {
    return this.call<{
      success: boolean;
    }>(`deleteDatabase?type=${this.getTypeEnum(type)}&name=${name}`)();
  }

  public async getAgent(secret: string) {
    const { success, token } = await this.call<{
      success: boolean;
      token: string;
    }>(`getAgent?secret=${secret}`)();
    return { success: success && token === this.token };
  }

  public getDatabase(type: ClientType, name: string) {
    return this.call<{
      success: boolean;
      schemas: EntitySchemaOptions<unknown>[];
    }>(`getDatabase?type=${this.getTypeEnum(type)}&name=${name}`)();
  }

  public postAgent(secret: string) {
    return this.call<{
      success: boolean;
    }>(`postAgent?secret=${secret}`)({ token: this.token });
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
