interface TaskGroup {
  parallel: boolean;
  tasks: Promise<unknown>[];
}

class Scheduler {
  private groups: TaskGroup[];
  private stakeholders: Set<Scheduler>;

  constructor() {
    this.groups = [];
    this.stakeholders = new Set();
  }

  public addStakeholder(scheduler: Scheduler): void {
    if (scheduler === this) return;
    this.stakeholders.add(scheduler);
  }

  public removeStakeholder(scheduler: Scheduler): void {
    if (scheduler === this) return;
    this.stakeholders.delete(scheduler);
  }

  public runTask<T>(
    task: () => T,
    parallel = false,
    standalone = false,
  ): Promise<Awaited<T>> {
    if (!this.groups.at(-1)?.parallel || !parallel) {
      this.groups.push({ parallel, tasks: [] });
    }
    const tasksOfLastGroup = this.groups.at(-2)?.tasks || [];
    const tasksOfNextGroup = this.groups.at(-1)?.tasks || [];
    const newTask = Promise.allSettled(tasksOfLastGroup).then(
      async (): Promise<Awaited<T>> => {
        try {
          const result = await task();
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
        stakeholder.runTask(() => newTask, parallel, true);
      }
    }
    return newTask;
  }
}

export { Scheduler };

Promise.allSettled([]).then((a) => console.log(a));
console.log('g');
