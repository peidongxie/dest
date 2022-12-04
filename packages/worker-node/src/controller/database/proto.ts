/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-non-null-assertion */
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'dest';

export interface DataItem {
  name: string;
  rows: string[];
}

export interface BaseRequest {
  type: string;
  name: string;
}

export interface SchemasRequest {
  type: string;
  name: string;
  schemas: string[];
}

export interface DataRequest {
  type: string;
  name: string;
  action: string;
  data: DataItem[];
}

export interface BaseResponse {
  success: boolean;
}

export interface DataResponse {
  success: boolean;
  data: DataItem[];
}

function createBaseDataItem(): DataItem {
  return { name: '', rows: [] };
}

export const DataItem = {
  encode(
    message: DataItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name);
    }
    for (const v of message.rows) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DataItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDataItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.rows.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DataItem {
    return {
      name: isSet(object.name) ? String(object.name) : '',
      rows: Array.isArray(object?.rows)
        ? object.rows.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: DataItem): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    if (message.rows) {
      obj.rows = message.rows.map((e) => e);
    } else {
      obj.rows = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DataItem>, I>>(object: I): DataItem {
    const message = createBaseDataItem();
    message.name = object.name ?? '';
    message.rows = object.rows?.map((e) => e) || [];
    return message;
  },
};

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

function createBaseSchemasRequest(): SchemasRequest {
  return { type: '', name: '', schemas: [] };
}

export const SchemasRequest = {
  encode(
    message: SchemasRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== '') {
      writer.uint32(10).string(message.type);
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
          message.type = reader.string();
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
      type: isSet(object.type) ? String(object.type) : '',
      name: isSet(object.name) ? String(object.name) : '',
      schemas: Array.isArray(object?.schemas)
        ? object.schemas.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: SchemasRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.name !== undefined && (obj.name = message.name);
    if (message.schemas) {
      obj.schemas = message.schemas.map((e) => e);
    } else {
      obj.schemas = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SchemasRequest>, I>>(
    object: I,
  ): SchemasRequest {
    const message = createBaseSchemasRequest();
    message.type = object.type ?? '';
    message.name = object.name ?? '';
    message.schemas = object.schemas?.map((e) => e) || [];
    return message;
  },
};

function createBaseDataRequest(): DataRequest {
  return { type: '', name: '', action: '', data: [] };
}

export const DataRequest = {
  encode(
    message: DataRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== '') {
      writer.uint32(10).string(message.type);
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name);
    }
    if (message.action !== '') {
      writer.uint32(26).string(message.action);
    }
    for (const v of message.data) {
      DataItem.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DataRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDataRequest();
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
          message.action = reader.string();
          break;
        case 4:
          message.data.push(DataItem.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DataRequest {
    return {
      type: isSet(object.type) ? String(object.type) : '',
      name: isSet(object.name) ? String(object.name) : '',
      action: isSet(object.action) ? String(object.action) : '',
      data: Array.isArray(object?.data)
        ? object.data.map((e: any) => DataItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: DataRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.name !== undefined && (obj.name = message.name);
    message.action !== undefined && (obj.action = message.action);
    if (message.data) {
      obj.data = message.data.map((e) => (e ? DataItem.toJSON(e) : undefined));
    } else {
      obj.data = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DataRequest>, I>>(
    object: I,
  ): DataRequest {
    const message = createBaseDataRequest();
    message.type = object.type ?? '';
    message.name = object.name ?? '';
    message.action = object.action ?? '';
    message.data = object.data?.map((e) => DataItem.fromPartial(e)) || [];
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

function createBaseDataResponse(): DataResponse {
  return { success: false, data: [] };
}

export const DataResponse = {
  encode(
    message: DataResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    for (const v of message.data) {
      DataItem.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DataResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDataResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        case 2:
          message.data.push(DataItem.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DataResponse {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      data: Array.isArray(object?.data)
        ? object.data.map((e: any) => DataItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: DataResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    if (message.data) {
      obj.data = message.data.map((e) => (e ? DataItem.toJSON(e) : undefined));
    } else {
      obj.data = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DataResponse>, I>>(
    object: I,
  ): DataResponse {
    const message = createBaseDataResponse();
    message.success = object.success ?? false;
    message.data = object.data?.map((e) => DataItem.fromPartial(e)) || [];
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
      requestType: BaseRequest,
      requestStream: false,
      responseType: BaseResponse,
      responseStream: false,
      options: {},
    },
    getDatabase: {
      name: 'GetDatabase',
      requestType: BaseRequest,
      requestStream: false,
      responseType: DataResponse,
      responseStream: false,
      options: {},
    },
    postDatabase: {
      name: 'PostDatabase',
      requestType: SchemasRequest,
      requestStream: false,
      responseType: BaseResponse,
      responseStream: false,
      options: {},
    },
    putDatabase: {
      name: 'PutDatabase',
      requestType: DataRequest,
      requestStream: false,
      responseType: BaseResponse,
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
