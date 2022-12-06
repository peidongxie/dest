import { type RequestWrapped } from './request';
import { type ResponseWrapped } from './response';
import { type ProtoDefinition, type ProtoMethod } from './type';

type PluginHandler<Method extends ProtoMethod> = (
  req: RequestWrapped<Method>,
) => ResponseWrapped<Method> | Promise<ResponseWrapped<Method>>;
interface Plugin<Definition extends ProtoDefinition> {
  definition: Definition;
  handlers: {
    [CallName in keyof Definition['methods']]?: PluginHandler<
      Definition['methods'][CallName]
    >;
  };
}

export { type Plugin, type PluginHandler };
