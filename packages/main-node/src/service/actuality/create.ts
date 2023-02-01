import { randomUUID } from 'crypto';
import {
  type Actuality,
  type ClientResult,
  type ClientSnapshot,
} from '../../domain';
import { createMemo } from '../memo';

const createActuality = <T>(
  readWriteResult: ClientResult<T>,
  introspectResult?: ClientResult<ClientSnapshot>,
): Actuality<T> | null => {
  const uuid = randomUUID();
  return createMemo(['actuality', uuid], {
    uuid,
    error: readWriteResult.error || introspectResult?.error || '',
    rows: readWriteResult.rows,
    snapshots: introspectResult?.rows || [],
    time: readWriteResult.time,
  });
};

export { createActuality };
