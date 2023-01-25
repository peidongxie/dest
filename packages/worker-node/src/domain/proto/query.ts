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

export enum EventAction {
  DEFAULT_ACTION = 0,
  SAVE = 1,
  REMOVE = 2,
  READ = 3,
  WRITE = 4,
  ROOT = 5,
  UNRECOGNIZED = -1,
}

export function eventActionFromJSON(object: any): EventAction {
  switch (object) {
    case 0:
    case 'DEFAULT_ACTION':
      return EventAction.DEFAULT_ACTION;
    case 1:
    case 'SAVE':
      return EventAction.SAVE;
    case 2:
    case 'REMOVE':
      return EventAction.REMOVE;
    case 3:
    case 'READ':
      return EventAction.READ;
    case 4:
    case 'WRITE':
      return EventAction.WRITE;
    case 5:
    case 'ROOT':
      return EventAction.ROOT;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return EventAction.UNRECOGNIZED;
  }
}

export function eventActionToJSON(object: EventAction): string {
  switch (object) {
    case EventAction.DEFAULT_ACTION:
      return 'DEFAULT_ACTION';
    case EventAction.SAVE:
      return 'SAVE';
    case EventAction.REMOVE:
      return 'REMOVE';
    case EventAction.READ:
      return 'READ';
    case EventAction.WRITE:
      return 'WRITE';
    case EventAction.ROOT:
      return 'ROOT';
    case EventAction.UNRECOGNIZED:
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

export interface ResultItem {
  time: number;
  error: string;
  rows: string[];
  snapshots: SnapshotItem[];
}

export interface ResultResponse {
  success: boolean;
  result: ResultItem | undefined;
}

export interface EventItem {
  action: EventAction;
  target: string;
  values: string[];
}

export interface EventRequest {
  type: BaseType;
  name: string;
  event: EventItem | undefined;
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

function createBaseResultItem(): ResultItem {
  return { time: 0, error: '', rows: [], snapshots: [] };
}

export const ResultItem = {
  encode(
    message: ResultItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.time !== 0) {
      writer.uint32(8).uint32(message.time);
    }
    if (message.error !== '') {
      writer.uint32(18).string(message.error);
    }
    for (const v of message.rows) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.snapshots) {
      SnapshotItem.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResultItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResultItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.time = reader.uint32();
          break;
        case 2:
          message.error = reader.string();
          break;
        case 3:
          message.rows.push(reader.string());
          break;
        case 4:
          message.snapshots.push(SnapshotItem.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ResultItem {
    return {
      time: isSet(object.time) ? Number(object.time) : 0,
      error: isSet(object.error) ? String(object.error) : '',
      rows: Array.isArray(object?.rows)
        ? object.rows.map((e: any) => String(e))
        : [],
      snapshots: Array.isArray(object?.snapshots)
        ? object.snapshots.map((e: any) => SnapshotItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ResultItem): unknown {
    const obj: any = {};
    message.time !== undefined && (obj.time = Math.round(message.time));
    message.error !== undefined && (obj.error = message.error);
    if (message.rows) {
      obj.rows = message.rows.map((e) => e);
    } else {
      obj.rows = [];
    }
    if (message.snapshots) {
      obj.snapshots = message.snapshots.map((e) =>
        e ? SnapshotItem.toJSON(e) : undefined,
      );
    } else {
      obj.snapshots = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ResultItem>, I>>(base?: I): ResultItem {
    return ResultItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ResultItem>, I>>(
    object: I,
  ): ResultItem {
    const message = createBaseResultItem();
    message.time = object.time ?? 0;
    message.error = object.error ?? '';
    message.rows = object.rows?.map((e) => e) || [];
    message.snapshots =
      object.snapshots?.map((e) => SnapshotItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseResultResponse(): ResultResponse {
  return { success: false, result: undefined };
}

export const ResultResponse = {
  encode(
    message: ResultResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    if (message.result !== undefined) {
      ResultItem.encode(message.result, writer.uint32(18).fork()).ldelim();
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
          message.result = ResultItem.decode(reader, reader.uint32());
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
      result: isSet(object.result)
        ? ResultItem.fromJSON(object.result)
        : undefined,
    };
  },

  toJSON(message: ResultResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    message.result !== undefined &&
      (obj.result = message.result
        ? ResultItem.toJSON(message.result)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<ResultResponse>, I>>(
    base?: I,
  ): ResultResponse {
    return ResultResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ResultResponse>, I>>(
    object: I,
  ): ResultResponse {
    const message = createBaseResultResponse();
    message.success = object.success ?? false;
    message.result =
      object.result !== undefined && object.result !== null
        ? ResultItem.fromPartial(object.result)
        : undefined;
    return message;
  },
};

function createBaseEventItem(): EventItem {
  return { action: 0, target: '', values: [] };
}

export const EventItem = {
  encode(
    message: EventItem,
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
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.action = reader.int32() as any;
          break;
        case 2:
          message.target = reader.string();
          break;
        case 3:
          message.values.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EventItem {
    return {
      action: isSet(object.action) ? eventActionFromJSON(object.action) : 0,
      target: isSet(object.target) ? String(object.target) : '',
      values: Array.isArray(object?.values)
        ? object.values.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: EventItem): unknown {
    const obj: any = {};
    message.action !== undefined &&
      (obj.action = eventActionToJSON(message.action));
    message.target !== undefined && (obj.target = message.target);
    if (message.values) {
      obj.values = message.values.map((e) => e);
    } else {
      obj.values = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EventItem>, I>>(base?: I): EventItem {
    return EventItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EventItem>, I>>(
    object: I,
  ): EventItem {
    const message = createBaseEventItem();
    message.action = object.action ?? 0;
    message.target = object.target ?? '';
    message.values = object.values?.map((e) => e) || [];
    return message;
  },
};

function createBaseEventRequest(): EventRequest {
  return { type: 0, name: '', event: undefined };
}

export const EventRequest = {
  encode(
    message: EventRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name);
    }
    if (message.event !== undefined) {
      EventItem.encode(message.event, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventRequest();
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
          message.event = EventItem.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EventRequest {
    return {
      type: isSet(object.type) ? baseTypeFromJSON(object.type) : 0,
      name: isSet(object.name) ? String(object.name) : '',
      event: isSet(object.event) ? EventItem.fromJSON(object.event) : undefined,
    };
  },

  toJSON(message: EventRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = baseTypeToJSON(message.type));
    message.name !== undefined && (obj.name = message.name);
    message.event !== undefined &&
      (obj.event = message.event ? EventItem.toJSON(message.event) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<EventRequest>, I>>(
    base?: I,
  ): EventRequest {
    return EventRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EventRequest>, I>>(
    object: I,
  ): EventRequest {
    const message = createBaseEventRequest();
    message.type = object.type ?? 0;
    message.name = object.name ?? '';
    message.event =
      object.event !== undefined && object.event !== null
        ? EventItem.fromPartial(object.event)
        : undefined;
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
      requestType: EventRequest,
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
