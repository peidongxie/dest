import { randomInt, randomUUID } from 'crypto';
import { type EntitySchemaOptions } from 'typeorm';
import { type AssertionActuality } from '../assertion';
import {
  type Client,
  type ClientEvent,
  type ClientSnapshot,
  type ClientType,
} from '../client';

class Context {
  private clients: Set<Client>;
  private name: string;
  private events: ClientEvent<unknown>[];
  private schemas: EntitySchemaOptions<unknown>[];
  private type: ClientType;

  constructor(type: ClientType, name: string) {
    this.type = type;
    this.name = name;
    this.schemas = [];
    this.events = [];
    this.clients = new Set();
  }

  public addClient(...clients: Client[]): Promise<void[]> {
    const promises = clients.map(async (client) => {
      await this.setDataset(this.schemas, this.events, client);
      this.clients.add(client);
    });
    return Promise.allSettled(promises).then((promiseSettledResults) =>
      promiseSettledResults.map((promiseSettledResult) => {
        if (promiseSettledResult.status === 'fulfilled') {
          return promiseSettledResult.value;
        } else {
          throw promiseSettledResult.reason;
        }
      }),
    );
  }

  public getDataset(): {
    schemas: EntitySchemaOptions<unknown>[];
    events: ClientEvent<unknown>[];
  } {
    return {
      schemas: this.schemas,
      events: this.events,
    };
  }

  public async read<T>(
    query: string,
    values: unknown[],
  ): Promise<AssertionActuality<T>> {
    const client = this.getClient();
    if (!client) throw new TypeError('No Client');
    const type = this.type;
    const name = this.name;
    const { result: readResult } = await client.postQuery<T>(type, name, {
      action: 'read',
      target: query,
      values,
    });
    return {
      uuid: randomUUID(),
      snapshots: [],
      rows: readResult.rows,
      error: readResult.error || '',
      time: readResult.time,
    };
  }

  public removeClient(...clients: Client[]): Promise<void[]> {
    const promises = clients.map(async (client) => {
      this.clients.delete(client);
      await client.deleteDatabase(this.type, this.name);
    });
    return Promise.allSettled(promises).then((promiseSettledResults) =>
      promiseSettledResults.map((promiseSettledResult) => {
        if (promiseSettledResult.status === 'fulfilled') {
          return promiseSettledResult.value;
        } else {
          throw promiseSettledResult.reason;
        }
      }),
    );
  }

  public async setDataset(
    schemas: EntitySchemaOptions<unknown>[],
    events: ClientEvent<unknown>[],
    client?: Client,
  ): Promise<void> {
    this.schemas = schemas;
    this.events = events;
    const clients = client ? [client] : Array.from(this.clients);
    const promises = clients.map(async (client) => {
      const { success: getAgentSuccess } = await client.getAgent();
      if (!getAgentSuccess) throw new TypeError('Bad Client');
      await client.deleteDatabase(this.type, this.name);
      const { success: postDatabaseSuccess } = await client.postDatabase(
        this.type,
        this.name,
        this.schemas,
      );
      if (!postDatabaseSuccess) throw new TypeError('Bad Schemas');
      for (const event of this.events) {
        const { success: postQuerySuccess } = await client.postQuery(
          this.type,
          this.name,
          event,
        );
        if (!postQuerySuccess) throw new TypeError('Bad Events');
      }
    });
    for (const promiseSettledResult of await Promise.allSettled(promises)) {
      if (promiseSettledResult.status === 'rejected') {
        throw promiseSettledResult.reason;
      }
    }
  }

  public async write<T>(
    query: string,
    values: unknown[],
    tables: string[],
  ): Promise<AssertionActuality<T>> {
    const client = this.getClient();
    if (!client) throw new TypeError('No Client');
    const type = this.type;
    const name = `${this.name}_${randomUUID().replaceAll('-', '_')}`;
    await client.postDatabase(type, name, this.schemas);
    for (const event of this.events) {
      await client.postQuery(type, name, event);
    }
    const { result: writeResult } = await client.postQuery<T>(type, name, {
      action: 'write',
      target: query,
      values,
    });
    const { result: introspectResult } = await client.postQuery<
      ClientSnapshot<unknown>
    >(type, name, {
      action: 'introspect',
      target: 'row',
      values: tables,
    });
    await client.deleteDatabase(type, name);
    return {
      uuid: randomUUID(),
      snapshots: introspectResult.rows,
      rows: writeResult.rows,
      error: writeResult.error || introspectResult.error || '',
      time: writeResult.time,
    };
  }

  private getClient(): Client | null {
    if (this.clients.size === 0) return null;
    return Array.from(this.clients)[randomInt(this.clients.size)];
  }
}

export { Context };
