import Client, {
  type ClientMethod,
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
  type ClientMethod,
  type ClientOptions,
  type RequestWrapped,
  type ResponseWrapped,
  type RpcType,
};
