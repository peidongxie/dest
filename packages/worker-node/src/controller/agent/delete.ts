import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { AgentDefinition } from '../../domain';
import { deleteAgent, readMemo } from '../../service';

const deleteAgentByHttp: Route = {
  method: 'DELETE',
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
    const agent = await deleteAgent();
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

const deleteAgentByRpc: Plugin<AgentDefinition> = {
  definition: AgentDefinition,
  handlers: {
    deleteAgent: async (req) => {
      const { secret } = req;
      const actualSecret = readMemo<string>(['secret']) || '';
      if (secret !== actualSecret) {
        return {
          success: false,
          token: '',
        };
      }
      const agent = await deleteAgent();
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

export { deleteAgentByHttp, deleteAgentByRpc };
