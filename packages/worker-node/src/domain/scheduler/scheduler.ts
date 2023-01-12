interface TaskGroup {
  parallel: boolean;
  tasks: Promise<unknown>[];
}

class Scheduler<T> {
  private groups: TaskGroup[];
  private stakeholders: Set<Scheduler<T>>;
  private target: T;

  constructor(target: T) {
    this.groups = [];
    this.stakeholders = new Set();
    this.target = target;
  }

  public addStakeholder(scheduler: Scheduler<T>): void {
    if (scheduler === this) return;
    this.stakeholders.add(scheduler);
  }

  public getTarget(): T {
    return this.target;
  }

  public removeStakeholder(scheduler: Scheduler<T>): void {
    if (scheduler === this) return;
    this.stakeholders.delete(scheduler);
  }

  public runTask<R>(
    task: (target: T) => R,
    parallel = false,
    standalone = false,
  ): Promise<Awaited<R>> {
    if (!this.groups.at(-1)?.parallel || !parallel) {
      this.groups.push({ parallel, tasks: [] });
    }
    const tasksOfLastGroup = this.groups.at(-2)?.tasks || [];
    const tasksOfNextGroup = this.groups.at(-1)?.tasks || [];
    const newTask = Promise.allSettled(tasksOfLastGroup).then(
      async (): Promise<Awaited<R>> => {
        try {
          const result = await task(this.target);
          this.groups.shift();
          return result;
        } catch (e) {
          this.groups.shift();
          throw e;
        }
      },
    );
    tasksOfNextGroup.push(newTask);
    if (!standalone) {
      for (const stakeholder of this.stakeholders) {
        stakeholder.runTask(
          () => Promise.allSettled([newTask]),
          parallel,
          true,
        );
      }
    }
    return newTask;
  }
}

export { Scheduler };
