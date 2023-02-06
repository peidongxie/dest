import { randomInt, randomUUID } from 'crypto';
import { type EntitySchemaOptions } from 'typeorm';
import { type Actuality } from '../actuality';
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

  constructor(
    type: ClientType,
    name: string,
    schemas: EntitySchemaOptions<unknown>[],
  ) {
    this.type = type;
    this.name = name;
    this.schemas = schemas;
    this.events = [];
    this.clients = new Set();
  }

  public addClient(...clients: Client[]): Promise<void[]> {
    const promises = clients.map(async (client) => {
      await this.setEvents(this.events, client);
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

  public async read<T>(
    query: string,
    values: unknown[],
  ): Promise<Actuality<T>> {
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
      error: readResult.error || '',
      rows: readResult.rows,
      snapshots: [],
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

  public async setEvents(
    events: ClientEvent<unknown>[],
    client?: Client,
  ): Promise<void> {
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
      for (const event of events) {
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
  ): Promise<Actuality<T>> {
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
      error: writeResult.error || introspectResult.error || '',
      rows: writeResult.rows,
      snapshots: introspectResult.rows,
      time: writeResult.time,
    };
  }

  private getClient(): Client | null {
    if (this.clients.size === 0) return null;
    return Array.from(this.clients)[randomInt(this.clients.size)];
  }
}

export { Context };
