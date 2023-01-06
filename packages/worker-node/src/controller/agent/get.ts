import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { AgentDefinition } from './proto';
import { readMemo } from '../../service';

const getAgentByHttp: Route = {
  method: 'GET',
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
    const token = await readMemo<string>(['token']);
    if (!token) {
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
        token,
      },
    };
  },
};

const getAgentByRpc: Plugin<AgentDefinition> = {
  definition: AgentDefinition,
  handlers: {
    getAgent: async (req) => {
      const { secret } = req;
      const actualSecret = readMemo<string>(['secret']) || '';
      if (secret !== actualSecret) {
        return {
          success: false,
          token: '',
        };
      }
      const token = await readMemo<string>(['token']);
      if (!token) {
        return {
          success: false,
          token: '',
        };
      }
      return {
        success: true,
        token,
      };
    },
  },
};

export { getAgentByHttp, getAgentByRpc };
