import {
  Client,
  type ProtoDefinition,
  type RequestWrapped,
  type ResponseWrapped,
} from '@dest-toolkit/grpc-client';

type KeysOfUnion<T> = T extends T ? keyof T : never;

type ValuesOfUnion<T, K extends KeysOfUnion<T>> = K extends K
  ? T extends Record<K, unknown>
    ? T[K]
    : never
  : never;

class RpcClient<Definition extends ProtoDefinition> {
  private raw: Client<Definition>;

  constructor(definitions: Definition[], port: number, hostname: string) {
    this.raw = new Client(definitions, {
      port,
      hostname,
    });
  }

  public call<CallName extends KeysOfUnion<Definition['methods']>>(
    name: CallName,
  ): (
    req: RequestWrapped<ValuesOfUnion<Definition['methods'], CallName>>,
  ) => Promise<
    ResponseWrapped<ValuesOfUnion<Definition['methods'], CallName>>
  > {
    return (req) => this.raw.call(name)(req);
  }
}

export { RpcClient };
