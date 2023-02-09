/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-non-null-assertion */
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'dest';

export interface SecretRequest {
  secret: string;
}

export interface SuccessResponse {
  success: boolean;
}

export interface UuidRequest {
  secret: string;
  uuid: string;
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

export interface PartItem {
  count: number;
  rows: string[];
}

export interface PartsResponse {
  success: boolean;
  uuid: string;
  snapshots: SnapshotItem[];
  parts: PartItem[];
}

export interface BenchmarkItem {
  snapshots: SnapshotItem[];
  parts: PartItem[];
}

export interface BenchmarkRequest {
  secret: string;
  benchmark: BenchmarkItem | undefined;
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSecretRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.secret = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUuidRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.secret = reader.string();
          break;
        case 2:
          message.uuid = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUuidResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        case 2:
          message.uuid = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSnapshotsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        case 2:
          message.uuid = reader.string();
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

function createBasePartItem(): PartItem {
  return { count: 0, rows: [] };
}

export const PartItem = {
  encode(
    message: PartItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.count !== 0) {
      writer.uint32(8).uint32(message.count);
    }
    for (const v of message.rows) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PartItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePartItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.count = reader.uint32();
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

  fromJSON(object: any): PartItem {
    return {
      count: isSet(object.count) ? Number(object.count) : 0,
      rows: Array.isArray(object?.rows)
        ? object.rows.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: PartItem): unknown {
    const obj: any = {};
    message.count !== undefined && (obj.count = Math.round(message.count));
    if (message.rows) {
      obj.rows = message.rows.map((e) => e);
    } else {
      obj.rows = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PartItem>, I>>(base?: I): PartItem {
    return PartItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PartItem>, I>>(object: I): PartItem {
    const message = createBasePartItem();
    message.count = object.count ?? 0;
    message.rows = object.rows?.map((e) => e) || [];
    return message;
  },
};

function createBasePartsResponse(): PartsResponse {
  return { success: false, uuid: '', snapshots: [], parts: [] };
}

export const PartsResponse = {
  encode(
    message: PartsResponse,
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
    for (const v of message.parts) {
      PartItem.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PartsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePartsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        case 2:
          message.uuid = reader.string();
          break;
        case 3:
          message.snapshots.push(SnapshotItem.decode(reader, reader.uint32()));
          break;
        case 4:
          message.parts.push(PartItem.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PartsResponse {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      uuid: isSet(object.uuid) ? String(object.uuid) : '',
      snapshots: Array.isArray(object?.snapshots)
        ? object.snapshots.map((e: any) => SnapshotItem.fromJSON(e))
        : [],
      parts: Array.isArray(object?.parts)
        ? object.parts.map((e: any) => PartItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: PartsResponse): unknown {
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
    if (message.parts) {
      obj.parts = message.parts.map((e) =>
        e ? PartItem.toJSON(e) : undefined,
      );
    } else {
      obj.parts = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PartsResponse>, I>>(
    base?: I,
  ): PartsResponse {
    return PartsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PartsResponse>, I>>(
    object: I,
  ): PartsResponse {
    const message = createBasePartsResponse();
    message.success = object.success ?? false;
    message.uuid = object.uuid ?? '';
    message.snapshots =
      object.snapshots?.map((e) => SnapshotItem.fromPartial(e)) || [];
    message.parts = object.parts?.map((e) => PartItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBenchmarkItem(): BenchmarkItem {
  return { snapshots: [], parts: [] };
}

export const BenchmarkItem = {
  encode(
    message: BenchmarkItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.snapshots) {
      SnapshotItem.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.parts) {
      PartItem.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BenchmarkItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBenchmarkItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.snapshots.push(SnapshotItem.decode(reader, reader.uint32()));
          break;
        case 2:
          message.parts.push(PartItem.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BenchmarkItem {
    return {
      snapshots: Array.isArray(object?.snapshots)
        ? object.snapshots.map((e: any) => SnapshotItem.fromJSON(e))
        : [],
      parts: Array.isArray(object?.parts)
        ? object.parts.map((e: any) => PartItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: BenchmarkItem): unknown {
    const obj: any = {};
    if (message.snapshots) {
      obj.snapshots = message.snapshots.map((e) =>
        e ? SnapshotItem.toJSON(e) : undefined,
      );
    } else {
      obj.snapshots = [];
    }
    if (message.parts) {
      obj.parts = message.parts.map((e) =>
        e ? PartItem.toJSON(e) : undefined,
      );
    } else {
      obj.parts = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BenchmarkItem>, I>>(
    base?: I,
  ): BenchmarkItem {
    return BenchmarkItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BenchmarkItem>, I>>(
    object: I,
  ): BenchmarkItem {
    const message = createBaseBenchmarkItem();
    message.snapshots =
      object.snapshots?.map((e) => SnapshotItem.fromPartial(e)) || [];
    message.parts = object.parts?.map((e) => PartItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBenchmarkRequest(): BenchmarkRequest {
  return { secret: '', benchmark: undefined };
}

export const BenchmarkRequest = {
  encode(
    message: BenchmarkRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.secret !== '') {
      writer.uint32(10).string(message.secret);
    }
    if (message.benchmark !== undefined) {
      BenchmarkItem.encode(
        message.benchmark,
        writer.uint32(18).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BenchmarkRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBenchmarkRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.secret = reader.string();
          break;
        case 2:
          message.benchmark = BenchmarkItem.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BenchmarkRequest {
    return {
      secret: isSet(object.secret) ? String(object.secret) : '',
      benchmark: isSet(object.benchmark)
        ? BenchmarkItem.fromJSON(object.benchmark)
        : undefined,
    };
  },

  toJSON(message: BenchmarkRequest): unknown {
    const obj: any = {};
    message.secret !== undefined && (obj.secret = message.secret);
    message.benchmark !== undefined &&
      (obj.benchmark = message.benchmark
        ? BenchmarkItem.toJSON(message.benchmark)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<BenchmarkRequest>, I>>(
    base?: I,
  ): BenchmarkRequest {
    return BenchmarkRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BenchmarkRequest>, I>>(
    object: I,
  ): BenchmarkRequest {
    const message = createBaseBenchmarkRequest();
    message.secret = object.secret ?? '';
    message.benchmark =
      object.benchmark !== undefined && object.benchmark !== null
        ? BenchmarkItem.fromPartial(object.benchmark)
        : undefined;
    return message;
  },
};

export type ExpectationDefinition = typeof ExpectationDefinition;
export const ExpectationDefinition = {
  name: 'Expectation',
  fullName: 'dest.Expectation',
  methods: {
    deleteExpectation: {
      name: 'DeleteExpectation',
      requestType: UuidRequest,
      requestStream: false,
      responseType: SuccessResponse,
      responseStream: false,
      options: {},
    },
    getExpectation: {
      name: 'GetExpectation',
      requestType: UuidRequest,
      requestStream: false,
      responseType: PartsResponse,
      responseStream: false,
      options: {},
    },
    postExpectation: {
      name: 'PostExpectation',
      requestType: BenchmarkRequest,
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
