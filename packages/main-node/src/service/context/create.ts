import { EntitySchemaOptions } from 'typeorm';
import {
  Context,
  Scheduler,
  type ClientEvent,
  type ClientType,
} from '../../domain';
import { readClients } from '../client';
import { createMemo } from '../memo';

const createContext = (
  type: ClientType,
  name: string,
  schemas?: EntitySchemaOptions<unknown>[],
  events?: ClientEvent<unknown>[],
): Promise<Scheduler<Context>> | null => {
  const scheduler = createMemo(
    ['context', type, name],
    new Scheduler(new Context(type, name, schemas, events)),
  );
  if (!scheduler) return null;
  const clients = readClients();
  const promise = scheduler.runTask(async (context) => {
    await context.addClient(...clients);
    return scheduler;
  });
  return promise;
};

export { createContext };
