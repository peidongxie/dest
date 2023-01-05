import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type Route } from '@dest-toolkit/http-client';
import { QueryDefinition } from './proto';

const postQueryByHttp: Route = {
  pathname: 'postQuery',
  redirect: '/query',
  method: 'POST',
};

const postQueryByRpc = QueryDefinition satisfies ProtoDefinition;

export { postQueryByHttp, postQueryByRpc };
