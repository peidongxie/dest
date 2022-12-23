import { type RequestWrapped } from './request';
import { type ResponseWrapped } from './response';

type PluginHandler<
  T extends Required<RequestWrapped> | Required<ResponseWrapped>,
> = (target: T) => T | Promise<T>;

interface Plugin {
  getReqHandler?(): PluginHandler<Required<RequestWrapped>>;
  getResHandler?(): PluginHandler<Required<ResponseWrapped>>;
}

export { type Plugin, type PluginHandler };
