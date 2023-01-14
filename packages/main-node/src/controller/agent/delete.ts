import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type Route } from '@dest-toolkit/http-client';
import { AgentDefinition } from './proto';

const deleteAgentByHttp: Route = {
  pathname: 'deleteAgent',
  redirect: '/agent',
  method: 'DELETE',
};

const deleteAgentByRpc = AgentDefinition satisfies ProtoDefinition;

export { deleteAgentByHttp, deleteAgentByRpc };
