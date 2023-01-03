class TaskRunner {
  private state: number;
  private tasks: (() => Promise<void>)[];

  constructor(state: number) {
    this.state = state;
    this.tasks = [];
  }

  protected runTask<T>(
    stateTransition: (state: number) => number | null,
    sideEffect: () => T | Promise<T>,
  ): Promise<T> {
    const state = stateTransition(this.state);
    if (state === null) return Promise.reject(new TypeError('Invalid task'));
    const promise = new Promise<T>((resolve, reject) => {
      this.state = state;
      this.tasks.push(async () => {
        try {
          const result = await sideEffect();
          this.tasks.shift();
          if (this.tasks.length > 0) {
            this.tasks[0]();
          }
          resolve(result);
        } catch (e) {
          this.tasks.shift();
          if (this.tasks.length > 0) {
            this.tasks[0]();
          }
          reject(e);
        }
      });
    });
    if (this.tasks.length === 1) {
      this.tasks[0]();
    }
    return promise;
  }
}

export { TaskRunner };
