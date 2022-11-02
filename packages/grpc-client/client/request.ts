import { type RpcType } from './type';

interface RequestWrappedMap<ReqMsg> {
  UNARY: ReqMsg;
  SERVER: ReqMsg;
  CLIENT: Iterable<ReqMsg> | AsyncIterable<ReqMsg>;
  BIDI: Iterable<ReqMsg> | AsyncIterable<ReqMsg>;
}

type RequestWrapped<T extends RpcType, ReqMsg> = RequestWrappedMap<ReqMsg>[T];

export { type RequestWrapped };
