import Client, {
  type ClientOptions,
  type ProtoDefinition,
  type ProtoMethod,
  type ReqMsg,
  type RequestWrapped,
  type ResMsg,
  type ResponseWrapped,
  type RpcType,
} from './client';

const createClient = <Definition extends ProtoDefinition>(
  ...args: ConstructorParameters<typeof Client>
): Client<Definition> => {
  return new Client(...args);
};

export {
  Client,
  createClient,
  type ClientOptions,
  type ProtoDefinition,
  type ProtoMethod,
  type ReqMsg,
  type RequestWrapped,
  type ResMsg,
  type ResponseWrapped,
  type RpcType,
};
