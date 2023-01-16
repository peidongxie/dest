class Memo<K, V> {
  private children: Map<K, Memo<K, V>>;
  private childrenSize: number;
  private current: V | undefined;
  private currentSize: 0 | 1;

  public get size(): number {
    return this.currentSize + this.childrenSize;
  }

  constructor(entries?: readonly (readonly [K[], V])[] | null) {
    this.current = undefined;
    this.currentSize = 0;
    this.children = new Map();
    this.childrenSize = 0;
    if (entries) {
      for (const [keys, value] of entries) {
        this.set(keys, value);
      }
    }
  }

  public clear(): void {
    this.current = undefined;
    this.childrenSize = 0;
    this.children.clear();
    this.childrenSize = 0;
  }

  public delete(keys: K[]): boolean {
    if (keys.length === 0) {
      if (!this.currentSize) return false;
      this.current = undefined;
      this.currentSize = 0;
      return true;
    }
    const [key, ...restKeys] = keys;
    if (!this.children.has(key)) {
      return false;
    }
    const child = this.children.get(key) as Memo<K, V>;
    const sizeBefore = child.size;
    const isRemoved = child.delete(restKeys);
    const sizeAfter = child.size;
    if (!sizeAfter) this.children.delete(key);
    this.childrenSize -= sizeBefore;
    this.childrenSize += sizeAfter;
    return isRemoved;
  }

  public deleteAll(keys: K[]): boolean {
    if (keys.length === 0) {
      const isRemoved = this.childrenSize > 0;
      this.children.clear();
      this.childrenSize = 0;
      return isRemoved;
    }
    const [key, ...restKeys] = keys;
    if (!this.children.has(key)) {
      return false;
    }
    const child = this.children.get(key) as Memo<K, V>;
    const sizeBefore = child.size;
    const isRemoved = child.deleteAll(restKeys);
    const sizeAfter = child.size;
    if (!sizeAfter) this.children.delete(key);
    this.childrenSize -= sizeBefore;
    this.childrenSize += sizeAfter;
    return isRemoved;
  }

  public forEach(
    callbackfn: (value: V, keys: K[], memo: Memo<K, V>) => void,
  ): void {
    if (this.currentSize) {
      callbackfn(this.current as V, [], this);
    }
    this.children.forEach((child, key) =>
      child.forEach((value, keys) => callbackfn(value, [key, ...keys], this)),
    );
  }

  public get(keys: K[]): V | undefined {
    if (keys.length === 0) {
      return this.current;
    }
    const [key, ...restKeys] = keys;
    if (!this.children.has(key)) {
      return undefined;
    }
    const child = this.children.get(key) as Memo<K, V>;
    return child.get(restKeys);
  }

  public getAll(keys: K[]): V[] {
    if (keys.length === 0) {
      const values: V[] = [];
      this.children.forEach((child) => {
        if (child.has([])) values.push(child.get([]) as V);
        values.push(...child.getAll([]));
      });
      return values;
    }
    const [key, ...restKeys] = keys;
    if (!this.children.has(key)) {
      return [];
    }
    const child = this.children.get(key) as Memo<K, V>;
    return child.getAll(restKeys);
  }

  public has(keys: K[]): boolean {
    if (keys.length === 0) {
      return this.currentSize > 0;
    }
    const [key, ...restKeys] = keys;
    if (!this.children.has(key)) {
      return false;
    }
    const child = this.children.get(key) as Memo<K, V>;
    return child.has(restKeys);
  }

  public set(keys: K[], value: V): this {
    if (keys.length === 0) {
      this.current = value;
      this.currentSize = 1;
      return this;
    }
    const [key, ...restKeys] = keys;
    if (!this.children.has(key)) {
      this.children.set(key, new Memo([[restKeys, value]]));
      this.childrenSize += 1;
      return this;
    }
    const child = this.children.get(key) as Memo<K, V>;
    const sizeBefore = child.size;
    child.set(restKeys, value);
    const sizeAfter = child.size;
    this.childrenSize -= sizeBefore;
    this.childrenSize += sizeAfter;
    return this;
  }

  public setAll(keys: K[], value: V): this {
    if (keys.length === 0) {
      this.children.forEach((child) => {
        if (child.has([])) child.set([], value);
        child.setAll([], value);
      });
      return this;
    }
    const [key, ...restKeys] = keys;
    if (!this.children.has(key)) {
      return this;
    }
    const child = this.children.get(key) as Memo<K, V>;
    child.setAll(restKeys, value);
    return this;
  }
}

export { Memo };
