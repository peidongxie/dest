import { EntitySchemaOptions } from 'typeorm';
import {
  type ClientEvent,
  type ClientType,
  type Context,
  type Scheduler,
} from '../../domain';
import { readMemo } from '../memo';

const updateContext = (
  type: ClientType,
  name: string,
  schemas: EntitySchemaOptions<unknown>[],
  events: ClientEvent<unknown>[],
): Promise<Scheduler<Context>> | null => {
  const scheduler = readMemo<Scheduler<Context>>(['context', type, name]);
  if (!scheduler) return null;
  const promise = scheduler.runTask(async (context) => {
    await context.setDataset(schemas, events);
    return scheduler;
  });
  return promise;
};

export { updateContext };
