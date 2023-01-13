import { type Scheduler } from '../../domain';
import { readMemo } from '../memo';

const readAgent = (): Scheduler<string> | null => {
  return readMemo<Scheduler<string>>(['agent']);
};

export { readAgent };
