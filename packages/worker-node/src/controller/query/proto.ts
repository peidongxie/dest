/* eslint-disable @typescript-eslint/no-explicit-any */
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'dest';

export enum QueryType {
  DEFAULT_TYPE = 0,
  SQLITE = 2049,
  MARIADB = 3306,
  MYSQL8 = 3307,
  MYSQL = 93307,
  UNRECOGNIZED = -1,
}

export function queryTypeFromJSON(object: any): QueryType {
  switch (object) {
    case 0:
    case 'DEFAULT_TYPE':
      return QueryType.DEFAULT_TYPE;
    case 2049:
    case 'SQLITE':
      return QueryType.SQLITE;
    case 3306:
    case 'MARIADB':
      return QueryType.MARIADB;
    case 3307:
    case 'MYSQL8':
      return QueryType.MYSQL8;
    case 93307:
    case 'MYSQL':
      return QueryType.MYSQL;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return QueryType.UNRECOGNIZED;
  }
}

export function queryTypeToJSON(object: QueryType): string {
  switch (object) {
    case QueryType.DEFAULT_TYPE:
      return 'DEFAULT_TYPE';
    case QueryType.SQLITE:
      return 'SQLITE';
    case QueryType.MARIADB:
      return 'MARIADB';
    case QueryType.MYSQL8:
      return 'MYSQL8';
    case QueryType.MYSQL:
      return 'MYSQL';
    case QueryType.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export enum QueryPrivilege {
  DEFAULT_PRIVILEGE = 0,
  READ = 1,
  WRITE = 2,
  ROOT = 3,
  UNRECOGNIZED = -1,
}

export function queryPrivilegeFromJSON(object: any): QueryPrivilege {
  switch (object) {
    case 0:
    case 'DEFAULT_PRIVILEGE':
      return QueryPrivilege.DEFAULT_PRIVILEGE;
    case 1:
    case 'READ':
      return QueryPrivilege.READ;
    case 2:
    case 'WRITE':
      return QueryPrivilege.WRITE;
    case 3:
    case 'ROOT':
      return QueryPrivilege.ROOT;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return QueryPrivilege.UNRECOGNIZED;
  }
}

export function queryPrivilegeToJSON(object: QueryPrivilege): string {
  switch (object) {
    case QueryPrivilege.DEFAULT_PRIVILEGE:
      return 'DEFAULT_PRIVILEGE';
    case QueryPrivilege.READ:
      return 'READ';
    case QueryPrivilege.WRITE:
      return 'WRITE';
    case QueryPrivilege.ROOT:
      return 'ROOT';
    case QueryPrivilege.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export interface BaseRequest {
  type: QueryType;
  name: string;
}

export interface QueryRequest {
  type: QueryType;
  name: string;
  privilege: QueryPrivilege;
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
  return { type: 0, name: '' };
}

export const BaseRequest = {
  encode(
    message: BaseRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
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
          message.type = reader.int32() as any;
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
      type: isSet(object.type) ? queryTypeFromJSON(object.type) : 0,
      name: isSet(object.name) ? String(object.name) : '',
    };
  },

  toJSON(message: BaseRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = queryTypeToJSON(message.type));
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BaseRequest>, I>>(
    object: I,
  ): BaseRequest {
    const message = createBaseBaseRequest();
    message.type = object.type ?? 0;
    message.name = object.name ?? '';
    return message;
  },
};

function createBaseQueryRequest(): QueryRequest {
  return { type: 0, name: '', privilege: 0, query: '' };
}

export const QueryRequest = {
  encode(
    message: QueryRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name);
    }
    if (message.privilege !== 0) {
      writer.uint32(24).int32(message.privilege);
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
          message.type = reader.int32() as any;
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.privilege = reader.int32() as any;
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
      type: isSet(object.type) ? queryTypeFromJSON(object.type) : 0,
      name: isSet(object.name) ? String(object.name) : '',
      privilege: isSet(object.privilege)
        ? queryPrivilegeFromJSON(object.privilege)
        : 0,
      query: isSet(object.query) ? String(object.query) : '',
    };
  },

  toJSON(message: QueryRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = queryTypeToJSON(message.type));
    message.name !== undefined && (obj.name = message.name);
    message.privilege !== undefined &&
      (obj.privilege = queryPrivilegeToJSON(message.privilege));
    message.query !== undefined && (obj.query = message.query);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryRequest>, I>>(
    object: I,
  ): QueryRequest {
    const message = createBaseQueryRequest();
    message.type = object.type ?? 0;
    message.name = object.name ?? '';
    message.privilege = object.privilege ?? 0;
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
