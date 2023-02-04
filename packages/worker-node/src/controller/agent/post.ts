import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { AgentDefinition } from '../../domain';
import { createAgent, readSecret } from '../../service';

const postAgentByHttp: Route = {
  method: 'POST',
  pathname: '/agent',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret');
    if ((secret || '') !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
        },
      };
    }
    const { body } = req;
    const { token } = await body.json<{ token: string }>();
    if (!token) {
      return {
        code: 400,
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
      const { secret } = req;
      if ((secret || '') !== readSecret()) {
        return {
          success: false,
        };
      }
      const { token } = req;
      if (!token) {
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
