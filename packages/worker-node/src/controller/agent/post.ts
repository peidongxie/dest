import { type Plugin } from '@dest-toolkit/grpc-server';
import { type Route } from '@dest-toolkit/http-server';
import { randomUUID } from 'crypto';
import { AgentDefinition } from './proto';
import { createMemo, readMemo } from '../../service';

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
    const token = await createMemo(['token'], randomUUID());
    if (!token) {
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
        token,
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
      const token = await createMemo(['token'], randomUUID());
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

export { postAgentByHttp, postAgentByRpc };
