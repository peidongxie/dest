import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type Route } from '@dest-toolkit/http-client';
import { AgentDefinition } from './proto';

const postAgentByHttp: Route = {
  pathname: 'postAgent',
  redirect: '/agent',
  method: 'POST',
};

const postAgentByRpc = AgentDefinition satisfies ProtoDefinition;

export { postAgentByHttp, postAgentByRpc };
