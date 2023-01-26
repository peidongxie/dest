/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-non-null-assertion */
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'dest';

export enum BaseType {
  DEFAULT_TYPE = 0,
  SQLITE = 2049,
  MARIADB = 3306,
  MYSQL8 = 3307,
  UNRECOGNIZED = -1,
}

export function baseTypeFromJSON(object: any): BaseType {
  switch (object) {
    case 0:
    case 'DEFAULT_TYPE':
      return BaseType.DEFAULT_TYPE;
    case 2049:
    case 'SQLITE':
      return BaseType.SQLITE;
    case 3306:
    case 'MARIADB':
      return BaseType.MARIADB;
    case 3307:
    case 'MYSQL8':
      return BaseType.MYSQL8;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return BaseType.UNRECOGNIZED;
  }
}

export function baseTypeToJSON(object: BaseType): string {
  switch (object) {
    case BaseType.DEFAULT_TYPE:
      return 'DEFAULT_TYPE';
    case BaseType.SQLITE:
      return 'SQLITE';
    case BaseType.MARIADB:
      return 'MARIADB';
    case BaseType.MYSQL8:
      return 'MYSQL8';
    case BaseType.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export interface BaseRequest {
  type: BaseType;
  name: string;
}

export interface BaseResponse {
  success: boolean;
}

export interface SnapshotItem {
  table: string;
  rows: string[];
}

export interface HierarchyItem {
  type: string;
  name: string;
  snapshots: SnapshotItem[];
}

export interface HierarchiesResponse {
  success: boolean;
  hierarchies: HierarchyItem[];
}

export interface SchemasRequest {
  type: BaseType;
  name: string;
  schemas: string[];
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
      type: isSet(object.type) ? baseTypeFromJSON(object.type) : 0,
      name: isSet(object.name) ? String(object.name) : '',
    };
  },

  toJSON(message: BaseRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = baseTypeToJSON(message.type));
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  create<I extends Exact<DeepPartial<BaseRequest>, I>>(base?: I): BaseRequest {
    return BaseRequest.fromPartial(base ?? {});
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

  create<I extends Exact<DeepPartial<BaseResponse>, I>>(
    base?: I,
  ): BaseResponse {
    return BaseResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BaseResponse>, I>>(
    object: I,
  ): BaseResponse {
    const message = createBaseBaseResponse();
    message.success = object.success ?? false;
    return message;
  },
};

function createBaseSnapshotItem(): SnapshotItem {
  return { table: '', rows: [] };
}

export const SnapshotItem = {
  encode(
    message: SnapshotItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.table !== '') {
      writer.uint32(18).string(message.table);
    }
    for (const v of message.rows) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SnapshotItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSnapshotItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.table = reader.string();
          break;
        case 3:
          message.rows.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SnapshotItem {
    return {
      table: isSet(object.table) ? String(object.table) : '',
      rows: Array.isArray(object?.rows)
        ? object.rows.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: SnapshotItem): unknown {
    const obj: any = {};
    message.table !== undefined && (obj.table = message.table);
    if (message.rows) {
      obj.rows = message.rows.map((e) => e);
    } else {
      obj.rows = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SnapshotItem>, I>>(
    base?: I,
  ): SnapshotItem {
    return SnapshotItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SnapshotItem>, I>>(
    object: I,
  ): SnapshotItem {
    const message = createBaseSnapshotItem();
    message.table = object.table ?? '';
    message.rows = object.rows?.map((e) => e) || [];
    return message;
  },
};

function createBaseHierarchyItem(): HierarchyItem {
  return { type: '', name: '', snapshots: [] };
}

export const HierarchyItem = {
  encode(
    message: HierarchyItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== '') {
      writer.uint32(10).string(message.type);
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name);
    }
    for (const v of message.snapshots) {
      SnapshotItem.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HierarchyItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHierarchyItem();
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
          message.snapshots.push(SnapshotItem.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HierarchyItem {
    return {
      type: isSet(object.type) ? String(object.type) : '',
      name: isSet(object.name) ? String(object.name) : '',
      snapshots: Array.isArray(object?.snapshots)
        ? object.snapshots.map((e: any) => SnapshotItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: HierarchyItem): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.name !== undefined && (obj.name = message.name);
    if (message.snapshots) {
      obj.snapshots = message.snapshots.map((e) =>
        e ? SnapshotItem.toJSON(e) : undefined,
      );
    } else {
      obj.snapshots = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HierarchyItem>, I>>(
    base?: I,
  ): HierarchyItem {
    return HierarchyItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<HierarchyItem>, I>>(
    object: I,
  ): HierarchyItem {
    const message = createBaseHierarchyItem();
    message.type = object.type ?? '';
    message.name = object.name ?? '';
    message.snapshots =
      object.snapshots?.map((e) => SnapshotItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseHierarchiesResponse(): HierarchiesResponse {
  return { success: false, hierarchies: [] };
}

export const HierarchiesResponse = {
  encode(
    message: HierarchiesResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    for (const v of message.hierarchies) {
      HierarchyItem.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HierarchiesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHierarchiesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        case 2:
          message.hierarchies.push(
            HierarchyItem.decode(reader, reader.uint32()),
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HierarchiesResponse {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      hierarchies: Array.isArray(object?.hierarchies)
        ? object.hierarchies.map((e: any) => HierarchyItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: HierarchiesResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    if (message.hierarchies) {
      obj.hierarchies = message.hierarchies.map((e) =>
        e ? HierarchyItem.toJSON(e) : undefined,
      );
    } else {
      obj.hierarchies = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HierarchiesResponse>, I>>(
    base?: I,
  ): HierarchiesResponse {
    return HierarchiesResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<HierarchiesResponse>, I>>(
    object: I,
  ): HierarchiesResponse {
    const message = createBaseHierarchiesResponse();
    message.success = object.success ?? false;
    message.hierarchies =
      object.hierarchies?.map((e) => HierarchyItem.fromPartial(e)) || [];
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
      type: isSet(object.type) ? baseTypeFromJSON(object.type) : 0,
      name: isSet(object.name) ? String(object.name) : '',
      schemas: Array.isArray(object?.schemas)
        ? object.schemas.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: SchemasRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = baseTypeToJSON(message.type));
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
      responseType: HierarchiesResponse,
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
