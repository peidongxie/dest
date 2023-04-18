interface ResultGroup<T> {
  parallel: boolean;
  results: Promise<T>[];
}

class Scheduler<T> {
  private readonly groups: ResultGroup<unknown>[];
  private readonly stakeholders: Set<Scheduler<unknown>>;
  private readonly target: T;

  constructor(target: T) {
    this.groups = [];
    this.stakeholders = new Set();
    this.target = target;
  }

  public addStakeholder(...schedulers: Scheduler<unknown>[]): void {
    for (const scheduler of schedulers) {
      if (scheduler === this) return;
      this.stakeholders.add(scheduler);
    }
  }

  public getTarget(): T {
    return this.target;
  }

  public removeStakeholder(...schedulers: Scheduler<unknown>[]): void {
    for (const scheduler of schedulers) {
      if (scheduler === this) return;
      this.stakeholders.delete(scheduler);
    }
  }

  public runTask<R>(
    task: (target: T) => R,
    parallel = false,
    standalone = false,
  ): Promise<Awaited<R>> {
    if (!this.groups.at(-1)?.parallel || !parallel) {
      this.groups.push({ parallel, results: [] });
    }
    const resultsOfLastGroup = this.groups.at(-2)?.results || [];
    const resultsOfNextGroup = this.groups.at(-1)?.results || [];
    const result = Promise.allSettled(resultsOfLastGroup).then(
      async (): Promise<Awaited<R>> => {
        try {
          const value = await task(this.target);
          this.groups.shift();
          return value;
        } catch (e) {
          this.groups.shift();
          throw e;
        }
      },
    );
    resultsOfNextGroup.push(result);
    if (!standalone) {
      const newTask = () => Promise.allSettled([result]);
      for (const stakeholder of this.stakeholders) {
        stakeholder.runTask(newTask, parallel, true);
      }
    }
    return result;
  }
}

export { Scheduler };
