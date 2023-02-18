type Parser = <T>(text: string) => T;

const createDeserializedObject = async <S, T>(
  creator: () => S | null | Promise<S | null>,
  transformer?: (
    source: NonNullable<S>,
    parser: Parser,
  ) => T | null | Promise<T | null>,
  validator?: (target: NonNullable<T>) => boolean | Promise<boolean>,
): Promise<T | null> => {
  try {
    const source = await creator();
    if (!source) return null;
    const target = await (transformer || ((source) => source as T))(
      source,
      (text) => JSON.parse(text),
    );
    if (!target) return null;
    const isValid = await (validator || (() => true))(target);
    if (!isValid) return null;
    return target;
  } catch {
    return null;
  }
};

type Stringifier = (value: unknown) => string;

const createSerializedObject = async <S, T>(
  creator: () => S | null | Promise<S | null>,
  transformer?: (
    source: NonNullable<S>,
    stringifier: Stringifier,
  ) => T | null | Promise<T | null>,
  validator?: (target: NonNullable<T>) => boolean | Promise<boolean>,
): Promise<T | null> => {
  try {
    const source = await creator();
    if (!source) return null;
    const target = await (transformer || ((source) => source as T))(
      source,
      (value) => JSON.stringify(value),
    );
    if (!target) return null;
    const isValid = await (validator || (() => true))(target);
    if (!isValid) return null;
    return target;
  } catch {
    return null;
  }
};

export { createDeserializedObject, createSerializedObject };
