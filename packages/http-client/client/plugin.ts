import { type RequestWrapped } from './request';
import { type ResponseWrapped } from './response';

type PluginHandler<T extends RequestWrapped | ResponseWrapped> = (
  target: T,
) => T | Promise<T>;

interface Plugin {
  getReqHandler?(): PluginHandler<RequestWrapped>;
  getResHandler?(): PluginHandler<ResponseWrapped>;
}

export { type Plugin, type PluginHandler };
