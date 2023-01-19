import { Client as ClientRaw, Router } from '@dest-toolkit/http-client';
import { type EntitySchemaOptions } from 'typeorm';
import { BaseType, EventAction } from '../../domain';
import {
  type ContextAction,
  type ContextEventItem,
  type ContextResultItem,
  type ContextType,
} from '../context';
import { type Client } from './type';

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

  public deleteDatabase(type: ContextType, name: string) {
    return this.call<{
      success: boolean;
    }>(`deleteDatabase?type=${this.getType(type)}&name=${name}`)();
  }

  public getAgent(secret: string) {
    return this.call<{
      success: boolean;
      token: string;
    }>(`getAgent?secret=${secret}`)();
  }

  public getDatabase(type: ContextType, name: string) {
    return this.call<{
      success: boolean;
      results: ContextResultItem<unknown>[];
    }>(`getDatabase?type=${this.getType(type)}&name=${name}`)();
  }

  public postAgent(secret: string) {
    return this.call<{
      success: boolean;
      token: string;
    }>(`postAgent?secret=${secret}`)();
  }

  public postDatabase(
    type: ContextType,
    name: string,
    schemas: EntitySchemaOptions<unknown>[],
  ) {
    return this.call<{
      success: boolean;
    }>(`postDatabase?type=${this.getType(type)}&name=${name}`)(schemas);
  }

  public postQuery<T>(
    type: ContextType,
    name: string,
    event: ContextEventItem<unknown>,
  ) {
    return this.call<{
      success: boolean;
      result: ContextResultItem<T>;
    }>(`postQuery?type=${this.getType(type)}&name=${name}`)({
      ...event,
      action: this.getAction(event.action),
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

export { HttpClient };
