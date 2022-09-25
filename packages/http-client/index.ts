import Client, { type PluginRequest, type PluginResponse } from './client';

const createClient = (
  ...args: ConstructorParameters<typeof Client>
): Client => {
  return new Client(...args);
};

export { Client, createClient, type PluginRequest, type PluginResponse };
