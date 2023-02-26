import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { AgentDefinition } from '../../domain';
import { createSerializedObject, deleteAgent, readSecret } from '../../service';

const deleteAgentByHttp: Route = {
  method: 'DELETE',
  pathname: '/agent',
  handler: async (req) => {
    const secret = req.url.searchParams.get('secret') || '';
    if (secret !== readSecret()) {
      return {
        code: 401,
        body: {
          success: false,
        },
      };
    }
    const agent = await createSerializedObject(() => deleteAgent());
    if (!agent) {
      return {
        code: 500,
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

const deleteAgentByRpc: Plugin<AgentDefinition> = {
  definition: AgentDefinition,
  handlers: {
    deleteAgent: async (req) => {
      if (req.secret !== readSecret()) {
        return {
          success: false,
        };
      }
      const agent = await createSerializedObject(() => deleteAgent());
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

export { deleteAgentByHttp, deleteAgentByRpc };
