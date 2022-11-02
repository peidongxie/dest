import Client, {
  type ClientDefinition,
  type ClientOptions,
  type RequestWrapped,
  type ResponseWrapped,
  type RpcType,
} from './client';

const createClient = (
  ...args: ConstructorParameters<typeof Client>
): Client => {
  return new Client(...args);
};

export {
  Client,
  createClient,
  type ClientDefinition,
  type ClientOptions,
  type RequestWrapped,
  type ResponseWrapped,
  type RpcType,
};
