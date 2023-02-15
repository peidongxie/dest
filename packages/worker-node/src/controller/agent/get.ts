import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { AgentDefinition } from '../../domain';
import { readAgent, readSecret } from '../../service';

const getAgentByHttp: Route = {
  method: 'GET',
  pathname: '/agent',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret') || '';
    if (secret !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
          token: '',
        },
      };
    }
    const agent = readAgent();
    if (!agent) {
      return {
        code: 404,
        body: {
          success: false,
          token: '',
        },
      };
    }
    return {
      code: 200,
      body: {
        success: true,
        token: agent,
      },
    };
  },
};

const getAgentByRpc: Plugin<AgentDefinition> = {
  definition: AgentDefinition,
  handlers: {
    getAgent: async (req) => {
      const { secret } = req;
      if (secret !== readSecret()) {
        return {
          success: false,
          token: '',
        };
      }
      const agent = readAgent();
      if (!agent) {
        return {
          success: false,
          token: '',
        };
      }
      return {
        success: true,
        token: agent,
      };
    },
  },
};

export { getAgentByHttp, getAgentByRpc };
