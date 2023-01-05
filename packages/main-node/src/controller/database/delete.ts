import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type Route } from '@dest-toolkit/http-client';
import { DatabaseDefinition } from './proto';

const deleteDatabaseByHttp: Route = {
  pathname: 'deleteDatabase',
  redirect: '/database',
  method: 'DELETE',
};

const deleteDatabaseByRpc = DatabaseDefinition satisfies ProtoDefinition;

export { deleteDatabaseByHttp, deleteDatabaseByRpc };
