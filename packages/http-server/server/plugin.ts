import { type PluginRequest } from './request';
import { type PluginResponse } from './response';
import { type HttpType } from './type';

type PluginHandler<T extends HttpType> = (
  req: PluginRequest<T>,
) => void | PluginResponse<T> | Promise<void | PluginResponse<T>>;

interface Plugin<T extends HttpType> {
  getHandler(): PluginHandler<T>;
}

export { type Plugin, type PluginHandler };
