/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-non-null-assertion */
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'dest';

export interface SecretRequest {
  secret: string;
}

export interface SuccessResponse {
  success: boolean;
}

export interface DifferenceItem {
  table: string;
  index: number;
  row: string;
  rows: string[];
}

export interface DifferencesResponse {
  success: boolean;
  differences: DifferenceItem[];
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

function createBaseDifferenceItem(): DifferenceItem {
  return { table: '', index: 0, row: '', rows: [] };
}

export const DifferenceItem = {
  encode(
    message: DifferenceItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.table !== '') {
      writer.uint32(10).string(message.table);
    }
    if (message.index !== 0) {
      writer.uint32(16).uint32(message.index);
    }
    if (message.row !== '') {
      writer.uint32(26).string(message.row);
    }
    for (const v of message.rows) {
      writer.uint32(34).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DifferenceItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDifferenceItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.table = reader.string();
          break;
        case 2:
          message.index = reader.uint32();
          break;
        case 3:
          message.row = reader.string();
          break;
        case 4:
          message.rows.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DifferenceItem {
    return {
      table: isSet(object.table) ? String(object.table) : '',
      index: isSet(object.index) ? Number(object.index) : 0,
      row: isSet(object.row) ? String(object.row) : '',
      rows: Array.isArray(object?.rows)
        ? object.rows.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: DifferenceItem): unknown {
    const obj: any = {};
    message.table !== undefined && (obj.table = message.table);
    message.index !== undefined && (obj.index = Math.round(message.index));
    message.row !== undefined && (obj.row = message.row);
    if (message.rows) {
      obj.rows = message.rows.map((e) => e);
    } else {
      obj.rows = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DifferenceItem>, I>>(
    base?: I,
  ): DifferenceItem {
    return DifferenceItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DifferenceItem>, I>>(
    object: I,
  ): DifferenceItem {
    const message = createBaseDifferenceItem();
    message.table = object.table ?? '';
    message.index = object.index ?? 0;
    message.row = object.row ?? '';
    message.rows = object.rows?.map((e) => e) || [];
    return message;
  },
};

function createBaseDifferencesResponse(): DifferencesResponse {
  return { success: false, differences: [] };
}

export const DifferencesResponse = {
  encode(
    message: DifferencesResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    for (const v of message.differences) {
      DifferenceItem.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DifferencesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDifferencesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        case 2:
          message.differences.push(
            DifferenceItem.decode(reader, reader.uint32()),
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DifferencesResponse {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      differences: Array.isArray(object?.differences)
        ? object.differences.map((e: any) => DifferenceItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: DifferencesResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    if (message.differences) {
      obj.differences = message.differences.map((e) =>
        e ? DifferenceItem.toJSON(e) : undefined,
      );
    } else {
      obj.differences = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DifferencesResponse>, I>>(
    base?: I,
  ): DifferencesResponse {
    return DifferencesResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DifferencesResponse>, I>>(
    object: I,
  ): DifferencesResponse {
    const message = createBaseDifferencesResponse();
    message.success = object.success ?? false;
    message.differences =
      object.differences?.map((e) => DifferenceItem.fromPartial(e)) || [];
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUuidsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.secret = reader.string();
          break;
        case 2:
          message.actuality = reader.string();
          break;
        case 3:
          message.expectation = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
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

export type AssertionDefinition = typeof AssertionDefinition;
export const AssertionDefinition = {
  name: 'Assertion',
  fullName: 'dest.Assertion',
  methods: {
    postAssertion: {
      name: 'PostAssertion',
      requestType: UuidsRequest,
      requestStream: false,
      responseType: DifferencesResponse,
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
