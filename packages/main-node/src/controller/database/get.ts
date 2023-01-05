import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type Route } from '@dest-toolkit/http-client';
import { DatabaseDefinition } from './proto';

const getDatabaseByHttp: Route = {
  pathname: 'getDatabase',
  redirect: '/database',
  method: 'GET',
};

const getDatabaseByRpc = DatabaseDefinition satisfies ProtoDefinition;

export { getDatabaseByHttp, getDatabaseByRpc };
