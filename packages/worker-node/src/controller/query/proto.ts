/* eslint-disable @typescript-eslint/no-explicit-any */
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'dest';

export interface BaseRequest {
  type: string;
  name: string;
}

export interface QueryRequest {
  type: string;
  name: string;
  privilege: string;
  query: string;
}

export interface BaseResponse {
  success: boolean;
}

export interface ResultResponse {
  success: boolean;
  time: number;
  result: string;
}

function createBaseBaseRequest(): BaseRequest {
  return { type: '', name: '' };
}

export const BaseRequest = {
  encode(
    message: BaseRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== '') {
      writer.uint32(10).string(message.type);
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BaseRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBaseRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BaseRequest {
    return {
      type: isSet(object.type) ? String(object.type) : '',
      name: isSet(object.name) ? String(object.name) : '',
    };
  },

  toJSON(message: BaseRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BaseRequest>, I>>(
    object: I,
  ): BaseRequest {
    const message = createBaseBaseRequest();
    message.type = object.type ?? '';
    message.name = object.name ?? '';
    return message;
  },
};

function createBaseQueryRequest(): QueryRequest {
  return { type: '', name: '', privilege: '', query: '' };
}

export const QueryRequest = {
  encode(
    message: QueryRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== '') {
      writer.uint32(10).string(message.type);
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name);
    }
    if (message.privilege !== '') {
      writer.uint32(26).string(message.privilege);
    }
    if (message.query !== '') {
      writer.uint32(34).string(message.query);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.privilege = reader.string();
          break;
        case 4:
          message.query = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryRequest {
    return {
      type: isSet(object.type) ? String(object.type) : '',
      name: isSet(object.name) ? String(object.name) : '',
      privilege: isSet(object.privilege) ? String(object.privilege) : '',
      query: isSet(object.query) ? String(object.query) : '',
    };
  },

  toJSON(message: QueryRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.name !== undefined && (obj.name = message.name);
    message.privilege !== undefined && (obj.privilege = message.privilege);
    message.query !== undefined && (obj.query = message.query);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryRequest>, I>>(
    object: I,
  ): QueryRequest {
    const message = createBaseQueryRequest();
    message.type = object.type ?? '';
    message.name = object.name ?? '';
    message.privilege = object.privilege ?? '';
    message.query = object.query ?? '';
    return message;
  },
};

function createBaseBaseResponse(): BaseResponse {
  return { success: false };
}

export const BaseResponse = {
  encode(
    message: BaseResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BaseResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBaseResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BaseResponse {
    return { success: isSet(object.success) ? Boolean(object.success) : false };
  },

  toJSON(message: BaseResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BaseResponse>, I>>(
    object: I,
  ): BaseResponse {
    const message = createBaseBaseResponse();
    message.success = object.success ?? false;
    return message;
  },
};

function createBaseResultResponse(): ResultResponse {
  return { success: false, time: 0, result: '' };
}

export const ResultResponse = {
  encode(
    message: ResultResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    if (message.time !== 0) {
      writer.uint32(16).uint32(message.time);
    }
    if (message.result !== '') {
      writer.uint32(26).string(message.result);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResultResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResultResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        case 2:
          message.time = reader.uint32();
          break;
        case 3:
          message.result = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ResultResponse {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      time: isSet(object.time) ? Number(object.time) : 0,
      result: isSet(object.result) ? String(object.result) : '',
    };
  },

  toJSON(message: ResultResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    message.time !== undefined && (obj.time = Math.round(message.time));
    message.result !== undefined && (obj.result = message.result);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ResultResponse>, I>>(
    object: I,
  ): ResultResponse {
    const message = createBaseResultResponse();
    message.success = object.success ?? false;
    message.time = object.time ?? 0;
    message.result = object.result ?? '';
    return message;
  },
};

export type QueryDefinition = typeof QueryDefinition;
export const QueryDefinition = {
  name: 'Query',
  fullName: 'dest.Query',
  methods: {
    postQuery: {
      name: 'PostQuery',
      requestType: QueryRequest,
      requestStream: false,
      responseType: ResultResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

type Builtin =
  | Date
  | ((...args: never[]) => void)
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends Record<string, unknown>
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
