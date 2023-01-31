import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { AgentDefinition } from '../../domain';
import { createAgent, readMemo } from '../../service';

const postAgentByHttp: Route = {
  method: 'POST',
  pathname: '/agent',
  handler: async (req) => {
    const { url, body } = req;
    const secret = url.searchParams.get('secret');
    const { token } = await body.json<{ token: string }>();
    const actualSecret = readMemo<string>(['secret']);
    if ((secret || '') !== (actualSecret || '') || !token) {
      return {
        code: 401,
        body: {
          success: false,
        },
      };
    }
    const agent = await createAgent(token);
    if (!agent) {
      return {
        code: 409,
        body: {
          success: false,
        },
      };
    }
    return {
      code: 200,
      body: {
        success: true,
      },
    };
  },
};

const postAgentByRpc: Plugin<AgentDefinition> = {
  definition: AgentDefinition,
  handlers: {
    postAgent: async (req) => {
      const { secret, token } = req;
      const actualSecret = readMemo<string>(['secret']);
      if ((secret || '') !== (actualSecret || '') || !token) {
        return {
          success: false,
        };
      }
      const agent = await createAgent(token);
      if (!agent) {
        return {
          success: false,
        };
      }
      return {
        success: true,
      };
    },
  },
};

export { postAgentByHttp, postAgentByRpc };
