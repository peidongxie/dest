import { type RequestWrapped } from './request';
import { type ResponseWrapped } from './response';

type PluginHandler = (
  req: RequestWrapped,
) => void | ResponseWrapped | Promise<void | ResponseWrapped>;

interface Plugin {
  getHandler(): PluginHandler;
}

export { type Plugin, type PluginHandler };
