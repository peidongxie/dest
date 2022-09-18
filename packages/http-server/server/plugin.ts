import { type PluginRequest } from './request';
import { type PluginResponse } from './response';
import { type HttpType } from './type';

type PluginHandler<T extends HttpType> = (
  req: PluginRequest<T>,
) => void | PluginResponse<T> | Promise<void | PluginResponse<T>>;

type CommonHandler<T extends HttpType = HttpType> = (
  T extends HttpType ? (handler: PluginHandler<T>) => void : never
) extends (handler: infer Infer) => void
  ? Infer
  : never;

interface Plugin<T extends HttpType> {
  getHandler(): PluginHandler<T>;
}

type CommonPlugin<T extends HttpType = HttpType> = (
  T extends HttpType ? (plugin: Plugin<T>) => void : never
) extends (plugin: infer Infer) => void
  ? Infer
  : never;

export {
  type CommonHandler,
  type CommonPlugin,
  type Plugin,
  type PluginHandler,
};
