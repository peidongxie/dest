import { type ProtoMethod, type ReqMsg, type RpcType } from './type';

interface RequestWrappedMap<ReqMsg> {
  UNARY: ReqMsg;
  SERVER: ReqMsg;
  CLIENT: Iterable<ReqMsg> | AsyncIterable<ReqMsg>;
  BIDI: Iterable<ReqMsg> | AsyncIterable<ReqMsg>;
}

type RequestWrapped<
  Method extends ProtoMethod,
  T extends 'UNARY' | 'SERVER' | 'CLIENT' | 'BIDI' = RpcType<Method>,
> = RequestWrappedMap<ReqMsg<Method>>[T];

export { type RequestWrapped };
