import {
  credentials,
  makeGenericClientConstructor,
  type ChannelCredentials,
  type ChannelOptions,
  type ServiceDefinition,
} from '@grpc/grpc-js';

type ClientDefinition = ServiceDefinition[keyof ServiceDefinition];

interface ClientOptions extends ChannelOptions {
  port?: number;
  hostname?: string;
  credentials?: ChannelCredentials;
}

type ServerRaw = InstanceType<ReturnType<typeof makeGenericClientConstructor>>;

class Client {
  private definitions: Record<string, ClientDefinition>;
  private raw: ServerRaw;

  constructor(
    definitions: ClientDefinition[] | Record<string, ClientDefinition>,
    options: ClientOptions,
  ) {
    this.definitions = Array.isArray(definitions)
      ? Object.fromEntries(
          definitions.map((definition) => [definition.path, definition]),
        )
      : Object.fromEntries(
          Object.entries(definitions).map((entry) => [entry[1].path, entry[1]]),
        );
    const GenericClient = makeGenericClientConstructor(this.definitions, '');
    const hostname = options?.hostname || 'localhost';
    const port = options?.port || 50051;
    this.raw = new GenericClient(
      `${hostname}:${port}`,
      options.credentials || credentials.createInsecure(),
      options,
    );
  }
}

export { Client as default };
