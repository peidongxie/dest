import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { AgentDefinition } from '../../domain';
import { createAgent, readMemo } from '../../service';

const postAgentByHttp: Route = {
  method: 'POST',
  pathname: '/agent',
  handler: async (req) => {
    const { url } = req;
    const secret = url.searchParams.get('secret') || '';
    const actualSecret = readMemo<string>(['secret']) || '';
    if (secret !== actualSecret) {
      return {
        code: 401,
        body: {
          success: false,
          token: '',
        },
      };
    }
    const agent = await createAgent();
    if (!agent) {
      return {
        code: 409,
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

const postAgentByRpc: Plugin<AgentDefinition> = {
  definition: AgentDefinition,
  handlers: {
    postAgent: async (req) => {
      const { secret } = req;
      const actualSecret = readMemo<string>(['secret']) || '';
      if (secret !== actualSecret) {
        return {
          success: false,
          token: '',
        };
      }
      const agent = await createAgent();
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

export { postAgentByHttp, postAgentByRpc };
