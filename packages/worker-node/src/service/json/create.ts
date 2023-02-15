type Parser = <T>(text: string) => T;

const createDeserializedObject = <S, T>(
  source: S,
  transformer: (source: NonNullable<S>, parser: Parser) => T | null,
  validator: (target: NonNullable<T>) => boolean,
): T | null => {
  if (!source) return null;
  try {
    const target = transformer(source, (text) => JSON.parse(text));
    if (!target) return null;
    const isValid = validator(target);
    if (!isValid) return null;
    return target;
  } catch {
    return null;
  }
};

export { createDeserializedObject };
