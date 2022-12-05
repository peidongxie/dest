import { type ProtoMethod, type ResMsg, type RpcType } from './type';

interface ResponseWrappedMap<ResMsg> {
  UNARY: ResMsg;
  SERVER: AsyncIterable<ResMsg>;
  CLIENT: ResMsg;
  BIDI: AsyncIterable<ResMsg>;
}
type ResponseWrapped<
  Method extends ProtoMethod,
  T extends 'UNARY' | 'SERVER' | 'CLIENT' | 'BIDI' = RpcType<Method>,
> = ResponseWrappedMap<ResMsg<Method>>[T];

export { type ResponseWrapped };
