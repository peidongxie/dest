import { type PluginRequest } from './request';
import { type PluginResponse } from './response';

type PluginHandler = (
  req: PluginRequest,
) => void | PluginResponse | Promise<void | PluginResponse>;

interface Plugin {
  getHandler(): PluginHandler;
}

export { type Plugin, type PluginHandler };
