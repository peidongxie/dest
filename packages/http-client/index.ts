import Client, {
  type ClientOptions,
  type RequestWrapped,
  type ResponseWrapped,
} from './client';

const createClient = (
  ...args: ConstructorParameters<typeof Client>
): Client => {
  return new Client(...args);
};

export {
  Client,
  createClient,
  type ClientOptions,
  type RequestWrapped,
  type ResponseWrapped,
};
