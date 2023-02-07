import { Client as ClientRaw, Router } from '@dest-toolkit/http-client';
import { type EntitySchemaOptions } from 'typeorm';
import { URLSearchParams } from 'url';
import { ActionEnum, LevelEnum, TypeEnum } from '../../domain';
import {
  type Client,
  type ClientAction,
  type ClientDatabase,
  type ClientEvent,
  type ClientHost,
  type ClientLevel,
  type ClientResult,
  type ClientType,
} from './type';

class HttpClient implements Client {
  private host: ClientHost;
  private raw: ClientRaw;
  private secret: string;
  private token: string;

  constructor(host: ClientHost, token: string, secret?: string) {
    const router = new Router({ host: 'localhost' });
    const base = `${host.hostname}:${host.port}`;
    router.setRoute({
      pathname: 'deleteAgent',
      redirect: base + '/agent',
      method: 'DELETE',
    });
    router.setRoute({
      pathname: 'deleteDatabase',
      redirect: base + '/database',
      method: 'DELETE',
    });
    router.setRoute({
      pathname: 'getAgent',
      redirect: base + '/agent',
      method: 'GET',
    });
    router.setRoute({
      pathname: 'getDatabase',
      redirect: base + '/database',
      method: 'GET',
    });
    router.setRoute({
      pathname: 'getHierarchy',
      redirect: base + '/hierarchy',
      method: 'GET',
    });
    router.setRoute({
      pathname: 'postAgent',
      redirect: base + '/agent',
      method: 'POST',
    });
    router.setRoute({
      pathname: 'postDatabase',
      redirect: base + '/database',
      method: 'POST',
    });
    router.setRoute({
      pathname: 'postQuery',
      redirect: base + '/query',
      method: 'POST',
    });
    this.raw = new ClientRaw();
    this.raw.use(router);
    this.host = host;
    this.token = token;
    this.secret = secret || '';
  }

  public deleteAgent() {
    const params = new URLSearchParams({
      secret: this.secret,
    });
    return this.call<{
      success: boolean;
    }>('deleteAgent?' + params.toString())();
  }

  public deleteDatabase(type: ClientType, name: string) {
    const params = new URLSearchParams({
      secret: this.secret,
      type: this.getTypeEnum(type).toString(),
      name,
    });
    return this.call<{
      success: boolean;
    }>('deleteDatabase?' + params.toString())();
  }

  public async getAgent() {
    const params = new URLSearchParams({
      secret: this.secret,
    });
    const { success, token } = await this.call<{
      success: boolean;
      token: string;
    }>('getAgent?' + params.toString())();
    return { success: success && token === this.token };
  }

  public getDatabase(type: ClientType, name: string) {
    const params = new URLSearchParams({
      secret: this.secret,
      type: this.getTypeEnum(type).toString(),
      name,
    });
    return this.call<{
      success: boolean;
      schemas: EntitySchemaOptions<unknown>[];
    }>('getDatabase?' + params.toString())();
  }

  public async getHierarchy(
    type: ClientType | '',
    name: string,
    table: string,
    level: ClientLevel,
  ) {
    const params = new URLSearchParams({
      secret: this.secret,
      type: this.getTypeEnum(type).toString(),
      name,
      table,
      level: this.getLevelEnum(level).toString(),
    });
    const { success, environments } = await this.call<{
      success: boolean;
      environments: { type: TypeEnum; databases: ClientDatabase[] }[];
    }>('getHierarchy?' + params.toString())();
    return {
      success,
      environments: environments.map((environment) => ({
        type: this.getType(environment.type),
        databases: environment.databases,
      })),
    };
  }

  public getSetup() {
    return { api: 'http' as const, ...this.host };
  }

  public postAgent() {
    const params = new URLSearchParams({
      secret: this.secret,
    });
    return this.call<{
      success: boolean;
    }>('postAgent?' + params.toString())({ token: this.token });
  }

  public postDatabase(
    type: ClientType,
    name: string,
    schemas: EntitySchemaOptions<unknown>[],
  ) {
    const params = new URLSearchParams({
      secret: this.secret,
      type: this.getTypeEnum(type).toString(),
      name,
    });
    return this.call<{
      success: boolean;
    }>('postDatabase?' + params.toString())(schemas);
  }

  public postQuery<T>(
    type: ClientType,
    name: string,
    event: ClientEvent<unknown>,
  ) {
    const params = new URLSearchParams({
      secret: this.secret,
      type: this.getTypeEnum(type).toString(),
      name,
    });
    return this.call<{
      success: boolean;
      result: ClientResult<T>;
    }>('postQuery?' + params.toString())({
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
    if (level === 'environment') return LevelEnum.ENVIRONMENT;
    if (level === 'database') return LevelEnum.DATABASE;
    if (level === 'table') return LevelEnum.TABLE;
    if (level === 'row') return LevelEnum.ROW;
    return LevelEnum.DEFAULT_LEVEL;
  }

  private getType(type: TypeEnum): ClientType | '' {
    if (type === TypeEnum.MARIADB) return 'mariadb';
    if (type === TypeEnum.MYSQL8) return 'mysql8';
    if (type === TypeEnum.SQLITE) return 'sqlite';
    return '';
  }

  private getTypeEnum(type: ClientType | ''): TypeEnum {
    if (type === 'mariadb') return TypeEnum.MARIADB;
    if (type === 'mysql8') return TypeEnum.MYSQL8;
    if (type === 'sqlite') return TypeEnum.SQLITE;
    return TypeEnum.DEFAULT_TYPE;
  }
}

export { HttpClient };
