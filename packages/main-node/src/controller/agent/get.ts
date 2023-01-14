import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type Route } from '@dest-toolkit/http-client';
import { AgentDefinition } from './proto';

const getAgentByHttp: Route = {
  pathname: 'getAgent',
  redirect: '/agent',
  method: 'GET',
};

const getAgentByRpc = AgentDefinition satisfies ProtoDefinition;

export { getAgentByHttp, getAgentByRpc };
