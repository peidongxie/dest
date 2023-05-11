/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-non-null-assertion */
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'dest';

export enum ActionEnum {
  DEFAULT_ACTION = 0,
  SAVE = 1,
  REMOVE = 2,
  READ = 3,
  WRITE = 4,
  ROOT = 5,
  INTROSPECT = 6,
  UNRECOGNIZED = -1,
}

export function actionEnumFromJSON(object: any): ActionEnum {
  switch (object) {
    case 0:
    case 'DEFAULT_ACTION':
      return ActionEnum.DEFAULT_ACTION;
    case 1:
    case 'SAVE':
      return ActionEnum.SAVE;
    case 2:
    case 'REMOVE':
      return ActionEnum.REMOVE;
    case 3:
    case 'READ':
      return ActionEnum.READ;
    case 4:
    case 'WRITE':
      return ActionEnum.WRITE;
    case 5:
    case 'ROOT':
      return ActionEnum.ROOT;
    case 6:
    case 'INTROSPECT':
      return ActionEnum.INTROSPECT;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ActionEnum.UNRECOGNIZED;
  }
}

export function actionEnumToJSON(object: ActionEnum): string {
  switch (object) {
    case ActionEnum.DEFAULT_ACTION:
      return 'DEFAULT_ACTION';
    case ActionEnum.SAVE:
      return 'SAVE';
    case ActionEnum.REMOVE:
      return 'REMOVE';
    case ActionEnum.READ:
      return 'READ';
    case ActionEnum.WRITE:
      return 'WRITE';
    case ActionEnum.ROOT:
      return 'ROOT';
    case ActionEnum.INTROSPECT:
      return 'INTROSPECT';
    case ActionEnum.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export enum TypeEnum {
  DEFAULT_TYPE = 0,
  SQLITE = 2049,
  MARIADB = 3306,
  MYSQL8 = 3307,
  MYSQL57 = 3308,
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
    case 3308:
    case 'MYSQL57':
      return TypeEnum.MYSQL57;
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
    case TypeEnum.MYSQL57:
      return 'MYSQL57';
    case TypeEnum.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export interface SecretRequest {
  secret: string;
}

export interface TypeRequest {
  secret: string;
  type: TypeEnum;
}

export interface NameRequest {
  secret: string;
  type: TypeEnum;
  name: string;
}

export interface ConditionItem {
  action: ActionEnum;
  target: string;
  values: string[];
  tables: string[];
}

export interface ConditionRequest {
  secret: string;
  type: TypeEnum;
  name: string;
  condition: ConditionItem | undefined;
}

export interface SuccessResponse {
  success: boolean;
}

export interface UuidRequest {
  secret: string;
  uuid: string;
}

export interface UuidsRequest {
  secret: string;
  actuality: string;
  expectation: string;
}

export interface UuidResponse {
  success: boolean;
  uuid: string;
}

export interface SnapshotItem {
  table: string;
  rows: string[];
}

export interface SnapshotsResponse {
  success: boolean;
  uuid: string;
  snapshots: SnapshotItem[];
}

export interface RowsResponse {
  success: boolean;
  uuid: string;
  snapshots: SnapshotItem[];
  rows: string[];
  error: string;
  time: number;
}

function createBaseSecretRequest(): SecretRequest {
  return { secret: '' };
}

export const SecretRequest = {
  encode(
    message: SecretRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.secret !== '') {
      writer.uint32(10).string(message.secret);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SecretRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSecretRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.secret = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SecretRequest {
    return { secret: isSet(object.secret) ? String(object.secret) : '' };
  },

  toJSON(message: SecretRequest): unknown {
    const obj: any = {};
    message.secret !== undefined && (obj.secret = message.secret);
    return obj;
  },

  create<I extends Exact<DeepPartial<SecretRequest>, I>>(
    base?: I,
  ): SecretRequest {
    return SecretRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SecretRequest>, I>>(
    object: I,
  ): SecretRequest {
    const message = createBaseSecretRequest();
    message.secret = object.secret ?? '';
    return message;
  },
};

function createBaseTypeRequest(): TypeRequest {
  return { secret: '', type: 0 };
}

export const TypeRequest = {
  encode(
    message: TypeRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.secret !== '') {
      writer.uint32(10).string(message.secret);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TypeRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTypeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.secret = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TypeRequest {
    return {
      secret: isSet(object.secret) ? String(object.secret) : '',
      type: isSet(object.type) ? typeEnumFromJSON(object.type) : 0,
    };
  },

  toJSON(message: TypeRequest): unknown {
    const obj: any = {};
    message.secret !== undefined && (obj.secret = message.secret);
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
    message.secret = object.secret ?? '';
    message.type = object.type ?? 0;
    return message;
  },
};

function createBaseNameRequest(): NameRequest {
  return { secret: '', type: 0, name: '' };
}

export const NameRequest = {
  encode(
    message: NameRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.secret !== '') {
      writer.uint32(10).string(message.secret);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.name !== '') {
      writer.uint32(26).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NameRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNameRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.secret = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): NameRequest {
    return {
      secret: isSet(object.secret) ? String(object.secret) : '',
      type: isSet(object.type) ? typeEnumFromJSON(object.type) : 0,
      name: isSet(object.name) ? String(object.name) : '',
    };
  },

  toJSON(message: NameRequest): unknown {
    const obj: any = {};
    message.secret !== undefined && (obj.secret = message.secret);
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
    message.secret = object.secret ?? '';
    message.type = object.type ?? 0;
    message.name = object.name ?? '';
    return message;
  },
};

function createBaseConditionItem(): ConditionItem {
  return { action: 0, target: '', values: [], tables: [] };
}

export const ConditionItem = {
  encode(
    message: ConditionItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.action !== 0) {
      writer.uint32(8).int32(message.action);
    }
    if (message.target !== '') {
      writer.uint32(18).string(message.target);
    }
    for (const v of message.values) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.tables) {
      writer.uint32(34).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConditionItem {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConditionItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.action = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.target = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.values.push(reader.string());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.tables.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConditionItem {
    return {
      action: isSet(object.action) ? actionEnumFromJSON(object.action) : 0,
      target: isSet(object.target) ? String(object.target) : '',
      values: Array.isArray(object?.values)
        ? object.values.map((e: any) => String(e))
        : [],
      tables: Array.isArray(object?.tables)
        ? object.tables.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: ConditionItem): unknown {
    const obj: any = {};
    message.action !== undefined &&
      (obj.action = actionEnumToJSON(message.action));
    message.target !== undefined && (obj.target = message.target);
    if (message.values) {
      obj.values = message.values.map((e) => e);
    } else {
      obj.values = [];
    }
    if (message.tables) {
      obj.tables = message.tables.map((e) => e);
    } else {
      obj.tables = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConditionItem>, I>>(
    base?: I,
  ): ConditionItem {
    return ConditionItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ConditionItem>, I>>(
    object: I,
  ): ConditionItem {
    const message = createBaseConditionItem();
    message.action = object.action ?? 0;
    message.target = object.target ?? '';
    message.values = object.values?.map((e) => e) || [];
    message.tables = object.tables?.map((e) => e) || [];
    return message;
  },
};

function createBaseConditionRequest(): ConditionRequest {
  return { secret: '', type: 0, name: '', condition: undefined };
}

export const ConditionRequest = {
  encode(
    message: ConditionRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.secret !== '') {
      writer.uint32(10).string(message.secret);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.name !== '') {
      writer.uint32(26).string(message.name);
    }
    if (message.condition !== undefined) {
      ConditionItem.encode(
        message.condition,
        writer.uint32(34).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConditionRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConditionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.secret = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.name = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.condition = ConditionItem.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConditionRequest {
    return {
      secret: isSet(object.secret) ? String(object.secret) : '',
      type: isSet(object.type) ? typeEnumFromJSON(object.type) : 0,
      name: isSet(object.name) ? String(object.name) : '',
      condition: isSet(object.condition)
        ? ConditionItem.fromJSON(object.condition)
        : undefined,
    };
  },

  toJSON(message: ConditionRequest): unknown {
    const obj: any = {};
    message.secret !== undefined && (obj.secret = message.secret);
    message.type !== undefined && (obj.type = typeEnumToJSON(message.type));
    message.name !== undefined && (obj.name = message.name);
    message.condition !== undefined &&
      (obj.condition = message.condition
        ? ConditionItem.toJSON(message.condition)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<ConditionRequest>, I>>(
    base?: I,
  ): ConditionRequest {
    return ConditionRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ConditionRequest>, I>>(
    object: I,
  ): ConditionRequest {
    const message = createBaseConditionRequest();
    message.secret = object.secret ?? '';
    message.type = object.type ?? 0;
    message.name = object.name ?? '';
    message.condition =
      object.condition !== undefined && object.condition !== null
        ? ConditionItem.fromPartial(object.condition)
        : undefined;
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
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSuccessResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.success = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
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

function createBaseUuidRequest(): UuidRequest {
  return { secret: '', uuid: '' };
}

export const UuidRequest = {
  encode(
    message: UuidRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.secret !== '') {
      writer.uint32(10).string(message.secret);
    }
    if (message.uuid !== '') {
      writer.uint32(18).string(message.uuid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UuidRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUuidRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.secret = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.uuid = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UuidRequest {
    return {
      secret: isSet(object.secret) ? String(object.secret) : '',
      uuid: isSet(object.uuid) ? String(object.uuid) : '',
    };
  },

  toJSON(message: UuidRequest): unknown {
    const obj: any = {};
    message.secret !== undefined && (obj.secret = message.secret);
    message.uuid !== undefined && (obj.uuid = message.uuid);
    return obj;
  },

  create<I extends Exact<DeepPartial<UuidRequest>, I>>(base?: I): UuidRequest {
    return UuidRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UuidRequest>, I>>(
    object: I,
  ): UuidRequest {
    const message = createBaseUuidRequest();
    message.secret = object.secret ?? '';
    message.uuid = object.uuid ?? '';
    return message;
  },
};

function createBaseUuidsRequest(): UuidsRequest {
  return { secret: '', actuality: '', expectation: '' };
}

export const UuidsRequest = {
  encode(
    message: UuidsRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.secret !== '') {
      writer.uint32(10).string(message.secret);
    }
    if (message.actuality !== '') {
      writer.uint32(18).string(message.actuality);
    }
    if (message.expectation !== '') {
      writer.uint32(26).string(message.expectation);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UuidsRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUuidsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.secret = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.actuality = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.expectation = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UuidsRequest {
    return {
      secret: isSet(object.secret) ? String(object.secret) : '',
      actuality: isSet(object.actuality) ? String(object.actuality) : '',
      expectation: isSet(object.expectation) ? String(object.expectation) : '',
    };
  },

  toJSON(message: UuidsRequest): unknown {
    const obj: any = {};
    message.secret !== undefined && (obj.secret = message.secret);
    message.actuality !== undefined && (obj.actuality = message.actuality);
    message.expectation !== undefined &&
      (obj.expectation = message.expectation);
    return obj;
  },

  create<I extends Exact<DeepPartial<UuidsRequest>, I>>(
    base?: I,
  ): UuidsRequest {
    return UuidsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UuidsRequest>, I>>(
    object: I,
  ): UuidsRequest {
    const message = createBaseUuidsRequest();
    message.secret = object.secret ?? '';
    message.actuality = object.actuality ?? '';
    message.expectation = object.expectation ?? '';
    return message;
  },
};

function createBaseUuidResponse(): UuidResponse {
  return { success: false, uuid: '' };
}

export const UuidResponse = {
  encode(
    message: UuidResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    if (message.uuid !== '') {
      writer.uint32(18).string(message.uuid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UuidResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUuidResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.success = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.uuid = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UuidResponse {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      uuid: isSet(object.uuid) ? String(object.uuid) : '',
    };
  },

  toJSON(message: UuidResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    message.uuid !== undefined && (obj.uuid = message.uuid);
    return obj;
  },

  create<I extends Exact<DeepPartial<UuidResponse>, I>>(
    base?: I,
  ): UuidResponse {
    return UuidResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UuidResponse>, I>>(
    object: I,
  ): UuidResponse {
    const message = createBaseUuidResponse();
    message.success = object.success ?? false;
    message.uuid = object.uuid ?? '';
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
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSnapshotItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.table = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.rows.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
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

function createBaseSnapshotsResponse(): SnapshotsResponse {
  return { success: false, uuid: '', snapshots: [] };
}

export const SnapshotsResponse = {
  encode(
    message: SnapshotsResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    if (message.uuid !== '') {
      writer.uint32(18).string(message.uuid);
    }
    for (const v of message.snapshots) {
      SnapshotItem.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SnapshotsResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSnapshotsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.success = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.uuid = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.snapshots.push(SnapshotItem.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SnapshotsResponse {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      uuid: isSet(object.uuid) ? String(object.uuid) : '',
      snapshots: Array.isArray(object?.snapshots)
        ? object.snapshots.map((e: any) => SnapshotItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: SnapshotsResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    message.uuid !== undefined && (obj.uuid = message.uuid);
    if (message.snapshots) {
      obj.snapshots = message.snapshots.map((e) =>
        e ? SnapshotItem.toJSON(e) : undefined,
      );
    } else {
      obj.snapshots = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SnapshotsResponse>, I>>(
    base?: I,
  ): SnapshotsResponse {
    return SnapshotsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SnapshotsResponse>, I>>(
    object: I,
  ): SnapshotsResponse {
    const message = createBaseSnapshotsResponse();
    message.success = object.success ?? false;
    message.uuid = object.uuid ?? '';
    message.snapshots =
      object.snapshots?.map((e) => SnapshotItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseRowsResponse(): RowsResponse {
  return {
    success: false,
    uuid: '',
    snapshots: [],
    rows: [],
    error: '',
    time: 0,
  };
}

export const RowsResponse = {
  encode(
    message: RowsResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    if (message.uuid !== '') {
      writer.uint32(18).string(message.uuid);
    }
    for (const v of message.snapshots) {
      SnapshotItem.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.rows) {
      writer.uint32(34).string(v!);
    }
    if (message.error !== '') {
      writer.uint32(42).string(message.error);
    }
    if (message.time !== 0) {
      writer.uint32(48).uint32(message.time);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RowsResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRowsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.success = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.uuid = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.snapshots.push(SnapshotItem.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.rows.push(reader.string());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.error = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.time = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RowsResponse {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      uuid: isSet(object.uuid) ? String(object.uuid) : '',
      snapshots: Array.isArray(object?.snapshots)
        ? object.snapshots.map((e: any) => SnapshotItem.fromJSON(e))
        : [],
      rows: Array.isArray(object?.rows)
        ? object.rows.map((e: any) => String(e))
        : [],
      error: isSet(object.error) ? String(object.error) : '',
      time: isSet(object.time) ? Number(object.time) : 0,
    };
  },

  toJSON(message: RowsResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    message.uuid !== undefined && (obj.uuid = message.uuid);
    if (message.snapshots) {
      obj.snapshots = message.snapshots.map((e) =>
        e ? SnapshotItem.toJSON(e) : undefined,
      );
    } else {
      obj.snapshots = [];
    }
    if (message.rows) {
      obj.rows = message.rows.map((e) => e);
    } else {
      obj.rows = [];
    }
    message.error !== undefined && (obj.error = message.error);
    message.time !== undefined && (obj.time = Math.round(message.time));
    return obj;
  },

  create<I extends Exact<DeepPartial<RowsResponse>, I>>(
    base?: I,
  ): RowsResponse {
    return RowsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RowsResponse>, I>>(
    object: I,
  ): RowsResponse {
    const message = createBaseRowsResponse();
    message.success = object.success ?? false;
    message.uuid = object.uuid ?? '';
    message.snapshots =
      object.snapshots?.map((e) => SnapshotItem.fromPartial(e)) || [];
    message.rows = object.rows?.map((e) => e) || [];
    message.error = object.error ?? '';
    message.time = object.time ?? 0;
    return message;
  },
};

export type ActualityDefinition = typeof ActualityDefinition;
export const ActualityDefinition = {
  name: 'Actuality',
  fullName: 'dest.Actuality',
  methods: {
    deleteActuality: {
      name: 'DeleteActuality',
      requestType: UuidRequest,
      requestStream: false,
      responseType: SuccessResponse,
      responseStream: false,
      options: {},
    },
    getActuality: {
      name: 'GetActuality',
      requestType: UuidRequest,
      requestStream: false,
      responseType: RowsResponse,
      responseStream: false,
      options: {},
    },
    postActuality: {
      name: 'PostActuality',
      requestType: ConditionRequest,
      requestStream: false,
      responseType: UuidResponse,
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
