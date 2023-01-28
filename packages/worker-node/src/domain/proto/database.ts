/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-non-null-assertion */
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'dest';

export enum TypeEnum {
  DEFAULT_TYPE = 0,
  SQLITE = 2049,
  MARIADB = 3306,
  MYSQL8 = 3307,
  UNRECOGNIZED = -1,
}

export function typeEnumFromJSON(object: any): TypeEnum {
  switch (object) {
    case 0:
    case 'DEFAULT_TYPE':
      return TypeEnum.DEFAULT_TYPE;
    case 2049:
    case 'SQLITE':
      return TypeEnum.SQLITE;
    case 3306:
    case 'MARIADB':
      return TypeEnum.MARIADB;
    case 3307:
    case 'MYSQL8':
      return TypeEnum.MYSQL8;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return TypeEnum.UNRECOGNIZED;
  }
}

export function typeEnumToJSON(object: TypeEnum): string {
  switch (object) {
    case TypeEnum.DEFAULT_TYPE:
      return 'DEFAULT_TYPE';
    case TypeEnum.SQLITE:
      return 'SQLITE';
    case TypeEnum.MARIADB:
      return 'MARIADB';
    case TypeEnum.MYSQL8:
      return 'MYSQL8';
    case TypeEnum.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export interface TypeRequest {
  type: TypeEnum;
}

export interface NameRequest {
  type: TypeEnum;
  name: string;
}

export interface SchemasRequest {
  type: TypeEnum;
  name: string;
  schemas: string[];
}

export interface SuccessResponse {
  success: boolean;
}

function createBaseTypeRequest(): TypeRequest {
  return { type: 0 };
}

export const TypeRequest = {
  encode(
    message: TypeRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TypeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTypeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TypeRequest {
    return { type: isSet(object.type) ? typeEnumFromJSON(object.type) : 0 };
  },

  toJSON(message: TypeRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = typeEnumToJSON(message.type));
    return obj;
  },

  create<I extends Exact<DeepPartial<TypeRequest>, I>>(base?: I): TypeRequest {
    return TypeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TypeRequest>, I>>(
    object: I,
  ): TypeRequest {
    const message = createBaseTypeRequest();
    message.type = object.type ?? 0;
    return message;
  },
};

function createBaseNameRequest(): NameRequest {
  return { type: 0, name: '' };
}

export const NameRequest = {
  encode(
    message: NameRequest,
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

  decode(input: _m0.Reader | Uint8Array, length?: number): NameRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNameRequest();
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

  fromJSON(object: any): NameRequest {
    return {
      type: isSet(object.type) ? typeEnumFromJSON(object.type) : 0,
      name: isSet(object.name) ? String(object.name) : '',
    };
  },

  toJSON(message: NameRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = typeEnumToJSON(message.type));
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  create<I extends Exact<DeepPartial<NameRequest>, I>>(base?: I): NameRequest {
    return NameRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<NameRequest>, I>>(
    object: I,
  ): NameRequest {
    const message = createBaseNameRequest();
    message.type = object.type ?? 0;
    message.name = object.name ?? '';
    return message;
  },
};

function createBaseSchemasRequest(): SchemasRequest {
  return { type: 0, name: '', schemas: [] };
}

export const SchemasRequest = {
  encode(
    message: SchemasRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name);
    }
    for (const v of message.schemas) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SchemasRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSchemasRequest();
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
          message.schemas.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SchemasRequest {
    return {
      type: isSet(object.type) ? typeEnumFromJSON(object.type) : 0,
      name: isSet(object.name) ? String(object.name) : '',
      schemas: Array.isArray(object?.schemas)
        ? object.schemas.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: SchemasRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = typeEnumToJSON(message.type));
    message.name !== undefined && (obj.name = message.name);
    if (message.schemas) {
      obj.schemas = message.schemas.map((e) => e);
    } else {
      obj.schemas = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SchemasRequest>, I>>(
    base?: I,
  ): SchemasRequest {
    return SchemasRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SchemasRequest>, I>>(
    object: I,
  ): SchemasRequest {
    const message = createBaseSchemasRequest();
    message.type = object.type ?? 0;
    message.name = object.name ?? '';
    message.schemas = object.schemas?.map((e) => e) || [];
    return message;
  },
};

function createBaseSuccessResponse(): SuccessResponse {
  return { success: false };
}

export const SuccessResponse = {
  encode(
    message: SuccessResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SuccessResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSuccessResponse();
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

  fromJSON(object: any): SuccessResponse {
    return { success: isSet(object.success) ? Boolean(object.success) : false };
  },

  toJSON(message: SuccessResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    return obj;
  },

  create<I extends Exact<DeepPartial<SuccessResponse>, I>>(
    base?: I,
  ): SuccessResponse {
    return SuccessResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SuccessResponse>, I>>(
    object: I,
  ): SuccessResponse {
    const message = createBaseSuccessResponse();
    message.success = object.success ?? false;
    return message;
  },
};

export type DatabaseDefinition = typeof DatabaseDefinition;
export const DatabaseDefinition = {
  name: 'Database',
  fullName: 'dest.Database',
  methods: {
    deleteDatabase: {
      name: 'DeleteDatabase',
      requestType: NameRequest,
      requestStream: false,
      responseType: SuccessResponse,
      responseStream: false,
      options: {},
    },
    getDatabase: {
      name: 'GetDatabase',
      requestType: NameRequest,
      requestStream: false,
      responseType: SuccessResponse,
      responseStream: false,
      options: {},
    },
    postDatabase: {
      name: 'PostDatabase',
      requestType: SchemasRequest,
      requestStream: false,
      responseType: SuccessResponse,
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
