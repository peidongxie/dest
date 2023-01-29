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

export enum LevelEnum {
  DEFAULT_LEVEL = 0,
  ENVIRONMENT = 1,
  DATABASE = 2,
  TABLE = 3,
  ROW = 4,
  UNRECOGNIZED = -1,
}

export function levelEnumFromJSON(object: any): LevelEnum {
  switch (object) {
    case 0:
    case 'DEFAULT_LEVEL':
      return LevelEnum.DEFAULT_LEVEL;
    case 1:
    case 'ENVIRONMENT':
      return LevelEnum.ENVIRONMENT;
    case 2:
    case 'DATABASE':
      return LevelEnum.DATABASE;
    case 3:
    case 'TABLE':
      return LevelEnum.TABLE;
    case 4:
    case 'ROW':
      return LevelEnum.ROW;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return LevelEnum.UNRECOGNIZED;
  }
}

export function levelEnumToJSON(object: LevelEnum): string {
  switch (object) {
    case LevelEnum.DEFAULT_LEVEL:
      return 'DEFAULT_LEVEL';
    case LevelEnum.ENVIRONMENT:
      return 'ENVIRONMENT';
    case LevelEnum.DATABASE:
      return 'DATABASE';
    case LevelEnum.TABLE:
      return 'TABLE';
    case LevelEnum.ROW:
      return 'ROW';
    case LevelEnum.UNRECOGNIZED:
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

export interface TableRequest {
  type: TypeEnum;
  name: string;
  table: string;
}

export interface LevelRequest {
  type: TypeEnum;
  name: string;
  table: string;
  level: LevelEnum;
}

export interface SuccessResponse {
  success: boolean;
}

export interface SnapshotItem {
  table: string;
  rows: string[];
}

export interface DatabaseItem {
  name: string;
  snapshots: SnapshotItem[];
}

export interface EnvironmentItem {
  type: TypeEnum;
  databases: DatabaseItem[];
}

export interface EnvironmentsResponse {
  success: boolean;
  environments: EnvironmentItem[];
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

function createBaseTableRequest(): TableRequest {
  return { type: 0, name: '', table: '' };
}

export const TableRequest = {
  encode(
    message: TableRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name);
    }
    if (message.table !== '') {
      writer.uint32(26).string(message.table);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TableRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTableRequest();
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
          message.table = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TableRequest {
    return {
      type: isSet(object.type) ? typeEnumFromJSON(object.type) : 0,
      name: isSet(object.name) ? String(object.name) : '',
      table: isSet(object.table) ? String(object.table) : '',
    };
  },

  toJSON(message: TableRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = typeEnumToJSON(message.type));
    message.name !== undefined && (obj.name = message.name);
    message.table !== undefined && (obj.table = message.table);
    return obj;
  },

  create<I extends Exact<DeepPartial<TableRequest>, I>>(
    base?: I,
  ): TableRequest {
    return TableRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TableRequest>, I>>(
    object: I,
  ): TableRequest {
    const message = createBaseTableRequest();
    message.type = object.type ?? 0;
    message.name = object.name ?? '';
    message.table = object.table ?? '';
    return message;
  },
};

function createBaseLevelRequest(): LevelRequest {
  return { type: 0, name: '', table: '', level: 0 };
}

export const LevelRequest = {
  encode(
    message: LevelRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name);
    }
    if (message.table !== '') {
      writer.uint32(26).string(message.table);
    }
    if (message.level !== 0) {
      writer.uint32(32).int32(message.level);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LevelRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLevelRequest();
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
          message.table = reader.string();
          break;
        case 4:
          message.level = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LevelRequest {
    return {
      type: isSet(object.type) ? typeEnumFromJSON(object.type) : 0,
      name: isSet(object.name) ? String(object.name) : '',
      table: isSet(object.table) ? String(object.table) : '',
      level: isSet(object.level) ? levelEnumFromJSON(object.level) : 0,
    };
  },

  toJSON(message: LevelRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = typeEnumToJSON(message.type));
    message.name !== undefined && (obj.name = message.name);
    message.table !== undefined && (obj.table = message.table);
    message.level !== undefined && (obj.level = levelEnumToJSON(message.level));
    return obj;
  },

  create<I extends Exact<DeepPartial<LevelRequest>, I>>(
    base?: I,
  ): LevelRequest {
    return LevelRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<LevelRequest>, I>>(
    object: I,
  ): LevelRequest {
    const message = createBaseLevelRequest();
    message.type = object.type ?? 0;
    message.name = object.name ?? '';
    message.table = object.table ?? '';
    message.level = object.level ?? 0;
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

function createBaseSnapshotItem(): SnapshotItem {
  return { table: '', rows: [] };
}

export const SnapshotItem = {
  encode(
    message: SnapshotItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.table !== '') {
      writer.uint32(10).string(message.table);
    }
    for (const v of message.rows) {
      writer.uint32(18).string(v!);
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
        case 1:
          message.table = reader.string();
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

function createBaseDatabaseItem(): DatabaseItem {
  return { name: '', snapshots: [] };
}

export const DatabaseItem = {
  encode(
    message: DatabaseItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name);
    }
    for (const v of message.snapshots) {
      SnapshotItem.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DatabaseItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDatabaseItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.snapshots.push(SnapshotItem.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DatabaseItem {
    return {
      name: isSet(object.name) ? String(object.name) : '',
      snapshots: Array.isArray(object?.snapshots)
        ? object.snapshots.map((e: any) => SnapshotItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: DatabaseItem): unknown {
    const obj: any = {};
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

  create<I extends Exact<DeepPartial<DatabaseItem>, I>>(
    base?: I,
  ): DatabaseItem {
    return DatabaseItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DatabaseItem>, I>>(
    object: I,
  ): DatabaseItem {
    const message = createBaseDatabaseItem();
    message.name = object.name ?? '';
    message.snapshots =
      object.snapshots?.map((e) => SnapshotItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseEnvironmentItem(): EnvironmentItem {
  return { type: 0, databases: [] };
}

export const EnvironmentItem = {
  encode(
    message: EnvironmentItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    for (const v of message.databases) {
      DatabaseItem.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EnvironmentItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEnvironmentItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.int32() as any;
          break;
        case 2:
          message.databases.push(DatabaseItem.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EnvironmentItem {
    return {
      type: isSet(object.type) ? typeEnumFromJSON(object.type) : 0,
      databases: Array.isArray(object?.databases)
        ? object.databases.map((e: any) => DatabaseItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: EnvironmentItem): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = typeEnumToJSON(message.type));
    if (message.databases) {
      obj.databases = message.databases.map((e) =>
        e ? DatabaseItem.toJSON(e) : undefined,
      );
    } else {
      obj.databases = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EnvironmentItem>, I>>(
    base?: I,
  ): EnvironmentItem {
    return EnvironmentItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EnvironmentItem>, I>>(
    object: I,
  ): EnvironmentItem {
    const message = createBaseEnvironmentItem();
    message.type = object.type ?? 0;
    message.databases =
      object.databases?.map((e) => DatabaseItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseEnvironmentsResponse(): EnvironmentsResponse {
  return { success: false, environments: [] };
}

export const EnvironmentsResponse = {
  encode(
    message: EnvironmentsResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    for (const v of message.environments) {
      EnvironmentItem.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): EnvironmentsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEnvironmentsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        case 2:
          message.environments.push(
            EnvironmentItem.decode(reader, reader.uint32()),
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EnvironmentsResponse {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      environments: Array.isArray(object?.environments)
        ? object.environments.map((e: any) => EnvironmentItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: EnvironmentsResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    if (message.environments) {
      obj.environments = message.environments.map((e) =>
        e ? EnvironmentItem.toJSON(e) : undefined,
      );
    } else {
      obj.environments = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EnvironmentsResponse>, I>>(
    base?: I,
  ): EnvironmentsResponse {
    return EnvironmentsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EnvironmentsResponse>, I>>(
    object: I,
  ): EnvironmentsResponse {
    const message = createBaseEnvironmentsResponse();
    message.success = object.success ?? false;
    message.environments =
      object.environments?.map((e) => EnvironmentItem.fromPartial(e)) || [];
    return message;
  },
};

export type HierarchyDefinition = typeof HierarchyDefinition;
export const HierarchyDefinition = {
  name: 'Hierarchy',
  fullName: 'dest.Hierarchy',
  methods: {
    getHierarchy: {
      name: 'GetHierarchy',
      requestType: LevelRequest,
      requestStream: false,
      responseType: EnvironmentsResponse,
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
