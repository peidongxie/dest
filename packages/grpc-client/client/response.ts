import { type RpcType } from './type';

interface ResponseWrappedMap<ResMsg> {
  UNARY: ResMsg;
  SERVER: AsyncIterable<ResMsg>;
  CLIENT: ResMsg;
  BIDI: AsyncIterable<ResMsg>;
}

type ResponseWrapped<T extends RpcType, ResMsg> = ResponseWrappedMap<ResMsg>[T];

export { type ResponseWrapped };
