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

export interface EventItem {
  action: ActionEnum;
  target: string;
  values: string[];
}

export interface EventRequest {
  secret: string;
  type: TypeEnum;
  name: string;
  event: EventItem | undefined;
}

export interface SuccessResponse {
  success: boolean;
}

export interface DatasetItem {
  schemas: string[];
  events: EventItem[];
}

export interface DatasetRequest {
  secret: string;
  type: TypeEnum;
  name: string;
  dataset: DatasetItem | undefined;
}

export interface DatasetResponse {
  success: boolean;
  dataset: DatasetItem | undefined;
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
          if (tag != 10) {
            break;
          }

          message.secret = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
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
          if (tag != 10) {
            break;
          }

          message.secret = reader.string();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
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
          if (tag != 10) {
            break;
          }

          message.secret = reader.string();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.name = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
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
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.action = reader.int32() as any;
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.target = reader.string();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.values.push(reader.string());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EventItem {
    return {
      action: isSet(object.action) ? actionEnumFromJSON(object.action) : 0,
      target: isSet(object.target) ? String(object.target) : '',
      values: Array.isArray(object?.values)
        ? object.values.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: EventItem): unknown {
    const obj: any = {};
    message.action !== undefined &&
      (obj.action = actionEnumToJSON(message.action));
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
  return { secret: '', type: 0, name: '', event: undefined };
}

export const EventRequest = {
  encode(
    message: EventRequest,
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
    if (message.event !== undefined) {
      EventItem.encode(message.event, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.secret = reader.string();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.name = reader.string();
          continue;
        case 4:
          if (tag != 34) {
            break;
          }

          message.event = EventItem.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EventRequest {
    return {
      secret: isSet(object.secret) ? String(object.secret) : '',
      type: isSet(object.type) ? typeEnumFromJSON(object.type) : 0,
      name: isSet(object.name) ? String(object.name) : '',
      event: isSet(object.event) ? EventItem.fromJSON(object.event) : undefined,
    };
  },

  toJSON(message: EventRequest): unknown {
    const obj: any = {};
    message.secret !== undefined && (obj.secret = message.secret);
    message.type !== undefined && (obj.type = typeEnumToJSON(message.type));
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
    message.secret = object.secret ?? '';
    message.type = object.type ?? 0;
    message.name = object.name ?? '';
    message.event =
      object.event !== undefined && object.event !== null
        ? EventItem.fromPartial(object.event)
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
          if (tag != 8) {
            break;
          }

          message.success = reader.bool();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
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

function createBaseDatasetItem(): DatasetItem {
  return { schemas: [], events: [] };
}

export const DatasetItem = {
  encode(
    message: DatasetItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.schemas) {
      writer.uint32(34).string(v!);
    }
    for (const v of message.events) {
      EventItem.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DatasetItem {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDatasetItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 4:
          if (tag != 34) {
            break;
          }

          message.schemas.push(reader.string());
          continue;
        case 5:
          if (tag != 42) {
            break;
          }

          message.events.push(EventItem.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DatasetItem {
    return {
      schemas: Array.isArray(object?.schemas)
        ? object.schemas.map((e: any) => String(e))
        : [],
      events: Array.isArray(object?.events)
        ? object.events.map((e: any) => EventItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: DatasetItem): unknown {
    const obj: any = {};
    if (message.schemas) {
      obj.schemas = message.schemas.map((e) => e);
    } else {
      obj.schemas = [];
    }
    if (message.events) {
      obj.events = message.events.map((e) =>
        e ? EventItem.toJSON(e) : undefined,
      );
    } else {
      obj.events = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DatasetItem>, I>>(base?: I): DatasetItem {
    return DatasetItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DatasetItem>, I>>(
    object: I,
  ): DatasetItem {
    const message = createBaseDatasetItem();
    message.schemas = object.schemas?.map((e) => e) || [];
    message.events = object.events?.map((e) => EventItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDatasetRequest(): DatasetRequest {
  return { secret: '', type: 0, name: '', dataset: undefined };
}

export const DatasetRequest = {
  encode(
    message: DatasetRequest,
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
    if (message.dataset !== undefined) {
      DatasetItem.encode(message.dataset, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DatasetRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDatasetRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.secret = reader.string();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.name = reader.string();
          continue;
        case 4:
          if (tag != 34) {
            break;
          }

          message.dataset = DatasetItem.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DatasetRequest {
    return {
      secret: isSet(object.secret) ? String(object.secret) : '',
      type: isSet(object.type) ? typeEnumFromJSON(object.type) : 0,
      name: isSet(object.name) ? String(object.name) : '',
      dataset: isSet(object.dataset)
        ? DatasetItem.fromJSON(object.dataset)
        : undefined,
    };
  },

  toJSON(message: DatasetRequest): unknown {
    const obj: any = {};
    message.secret !== undefined && (obj.secret = message.secret);
    message.type !== undefined && (obj.type = typeEnumToJSON(message.type));
    message.name !== undefined && (obj.name = message.name);
    message.dataset !== undefined &&
      (obj.dataset = message.dataset
        ? DatasetItem.toJSON(message.dataset)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<DatasetRequest>, I>>(
    base?: I,
  ): DatasetRequest {
    return DatasetRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DatasetRequest>, I>>(
    object: I,
  ): DatasetRequest {
    const message = createBaseDatasetRequest();
    message.secret = object.secret ?? '';
    message.type = object.type ?? 0;
    message.name = object.name ?? '';
    message.dataset =
      object.dataset !== undefined && object.dataset !== null
        ? DatasetItem.fromPartial(object.dataset)
        : undefined;
    return message;
  },
};

function createBaseDatasetResponse(): DatasetResponse {
  return { success: false, dataset: undefined };
}

export const DatasetResponse = {
  encode(
    message: DatasetResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    if (message.dataset !== undefined) {
      DatasetItem.encode(message.dataset, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DatasetResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDatasetResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.success = reader.bool();
          continue;
        case 4:
          if (tag != 34) {
            break;
          }

          message.dataset = DatasetItem.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DatasetResponse {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      dataset: isSet(object.dataset)
        ? DatasetItem.fromJSON(object.dataset)
        : undefined,
    };
  },

  toJSON(message: DatasetResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    message.dataset !== undefined &&
      (obj.dataset = message.dataset
        ? DatasetItem.toJSON(message.dataset)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<DatasetResponse>, I>>(
    base?: I,
  ): DatasetResponse {
    return DatasetResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DatasetResponse>, I>>(
    object: I,
  ): DatasetResponse {
    const message = createBaseDatasetResponse();
    message.success = object.success ?? false;
    message.dataset =
      object.dataset !== undefined && object.dataset !== null
        ? DatasetItem.fromPartial(object.dataset)
        : undefined;
    return message;
  },
};

export type ContextDefinition = typeof ContextDefinition;
export const ContextDefinition = {
  name: 'Context',
  fullName: 'dest.Context',
  methods: {
    deleteContext: {
      name: 'DeleteContext',
      requestType: NameRequest,
      requestStream: false,
      responseType: SuccessResponse,
      responseStream: false,
      options: {},
    },
    getContext: {
      name: 'GetContext',
      requestType: NameRequest,
      requestStream: false,
      responseType: DatasetResponse,
      responseStream: false,
      options: {},
    },
    postContext: {
      name: 'PostContext',
      requestType: DatasetRequest,
      requestStream: false,
      responseType: SuccessResponse,
      responseStream: false,
      options: {},
    },
    updateContext: {
      name: 'UpdateContext',
      requestType: DatasetRequest,
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
