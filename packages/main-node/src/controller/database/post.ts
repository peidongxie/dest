import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type Route } from '@dest-toolkit/http-client';
import { DatabaseDefinition } from './proto';

const postDatabaseByHttp: Route = {
  pathname: 'postDatabase',
  redirect: '/database',
  method: 'POST',
};

const postDatabaseByRpc = DatabaseDefinition satisfies ProtoDefinition;

export { postDatabaseByHttp, postDatabaseByRpc };
