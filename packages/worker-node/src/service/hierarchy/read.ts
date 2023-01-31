import { type AdapterType, type HierarchyEnvironment } from '../../domain';
import { readDatabase, readDatabases } from '../database';
import { readMemos } from '../memo';

const readHierarchyEnvironment = (): HierarchyEnvironment[] => {
  const types = readMemos<AdapterType>(['type']);
  const environments = types.map((type) => ({
    type,
    databases: [],
  }));
  return environments;
};

const readHierarchyDatabase = (type?: AdapterType): HierarchyEnvironment[] => {
  const types = readMemos<AdapterType>(['type']);
  const environments = (type ? [type] : types).map((type) => {
    const schedulers = readDatabases(type);
    const databases = schedulers.map((scheduler) => ({
      name: scheduler.getTarget().getName(),
      snapshots: [],
    }));
    return {
      type,
      databases,
    };
  });
  return environments;
};

const readHierarchyTable = (
  type?: AdapterType,
  name?: string,
): Promise<HierarchyEnvironment[]> => {
  const types = readMemos<AdapterType>(['type']);
  const environments = (type ? [type] : types).map((type) => {
    const schedulers = readDatabases(type);
    const scheduler = name && readDatabase(type, name);
    const databases = (scheduler ? [scheduler] : name ? [] : schedulers).map(
      (scheduler) => {
        const promise = scheduler.runTask(async (database) => {
          const snapshots =
            (
              await database.introspect<{ table: string }>('table', [])
            )?.rows.map((row) => ({ table: row.table, rows: [] })) || [];
          return snapshots;
        }, true);
        return promise.then((snapshots) => ({
          name: scheduler.getTarget().getName(),
          snapshots,
        }));
      },
    );
    return Promise.all(databases).then((databases) => ({
      type,
      databases,
    }));
  });
  return Promise.all(environments);
};

const readHierarchyRow = (
  type?: AdapterType,
  name?: string,
  table?: string,
): Promise<HierarchyEnvironment[]> => {
  const types = readMemos<AdapterType>(['type']);
  const environments = (type ? [type] : types).map((type) => {
    const schedulers = readDatabases(type);
    const scheduler = name && readDatabase(type, name);
    const databases = (scheduler ? [scheduler] : name ? [] : schedulers).map(
      (scheduler) => {
        const promise = scheduler.runTask(async (database) => {
          const snapshots =
            (
              await database.introspect<{ table: string }>('table', [])
            )?.rows.map((row) => ({ table: row.table, rows: [] })) || [];
          const snapshot =
            table && snapshots.find((snapshot) => snapshot.table === table);
          return (
            (
              await database.introspect<{ table: string; rows: unknown[] }>(
                'row',
                (snapshot ? [snapshot] : table ? [] : snapshots).map(
                  ({ table }) => table,
                ),
              )
            )?.rows || snapshots
          );
        }, true);
        return promise.then((snapshots) => ({
          name: scheduler.getTarget().getName(),
          snapshots,
        }));
      },
    );
    return Promise.all(databases).then((databases) => ({
      type,
      databases,
    }));
  });
  return Promise.all(environments);
};

export {
  readHierarchyDatabase,
  readHierarchyEnvironment,
  readHierarchyRow,
  readHierarchyTable,
};
