/* eslint-disable @typescript-eslint/no-explicit-any */
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'dest';

export interface SecretRequest {
  secret: string;
}

export interface SuccessResponse {
  success: boolean;
}

export interface TokenRequest {
  secret: string;
  token: string;
}

export interface TokenResponse {
  success: boolean;
  token: string;
}

export interface SetupItem {
  api: string;
  hostname: string;
  port: number;
}

export interface SetupRequest {
  secret: string;
  token: string;
  setup: SetupItem | undefined;
}

export interface SetupResponse {
  success: boolean;
  setup: SetupItem | undefined;
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

function createBaseTokenRequest(): TokenRequest {
  return { secret: '', token: '' };
}

export const TokenRequest = {
  encode(
    message: TokenRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.secret !== '') {
      writer.uint32(10).string(message.secret);
    }
    if (message.token !== '') {
      writer.uint32(18).string(message.token);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenRequest();
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
          if (tag != 18) {
            break;
          }

          message.token = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TokenRequest {
    return {
      secret: isSet(object.secret) ? String(object.secret) : '',
      token: isSet(object.token) ? String(object.token) : '',
    };
  },

  toJSON(message: TokenRequest): unknown {
    const obj: any = {};
    message.secret !== undefined && (obj.secret = message.secret);
    message.token !== undefined && (obj.token = message.token);
    return obj;
  },

  create<I extends Exact<DeepPartial<TokenRequest>, I>>(
    base?: I,
  ): TokenRequest {
    return TokenRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TokenRequest>, I>>(
    object: I,
  ): TokenRequest {
    const message = createBaseTokenRequest();
    message.secret = object.secret ?? '';
    message.token = object.token ?? '';
    return message;
  },
};

function createBaseTokenResponse(): TokenResponse {
  return { success: false, token: '' };
}

export const TokenResponse = {
  encode(
    message: TokenResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    if (message.token !== '') {
      writer.uint32(18).string(message.token);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.success = reader.bool();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.token = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TokenResponse {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      token: isSet(object.token) ? String(object.token) : '',
    };
  },

  toJSON(message: TokenResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    message.token !== undefined && (obj.token = message.token);
    return obj;
  },

  create<I extends Exact<DeepPartial<TokenResponse>, I>>(
    base?: I,
  ): TokenResponse {
    return TokenResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TokenResponse>, I>>(
    object: I,
  ): TokenResponse {
    const message = createBaseTokenResponse();
    message.success = object.success ?? false;
    message.token = object.token ?? '';
    return message;
  },
};

function createBaseSetupItem(): SetupItem {
  return { api: '', hostname: '', port: 0 };
}

export const SetupItem = {
  encode(
    message: SetupItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.api !== '') {
      writer.uint32(10).string(message.api);
    }
    if (message.hostname !== '') {
      writer.uint32(18).string(message.hostname);
    }
    if (message.port !== 0) {
      writer.uint32(24).uint32(message.port);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetupItem {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetupItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.api = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.hostname = reader.string();
          continue;
        case 3:
          if (tag != 24) {
            break;
          }

          message.port = reader.uint32();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetupItem {
    return {
      api: isSet(object.api) ? String(object.api) : '',
      hostname: isSet(object.hostname) ? String(object.hostname) : '',
      port: isSet(object.port) ? Number(object.port) : 0,
    };
  },

  toJSON(message: SetupItem): unknown {
    const obj: any = {};
    message.api !== undefined && (obj.api = message.api);
    message.hostname !== undefined && (obj.hostname = message.hostname);
    message.port !== undefined && (obj.port = Math.round(message.port));
    return obj;
  },

  create<I extends Exact<DeepPartial<SetupItem>, I>>(base?: I): SetupItem {
    return SetupItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SetupItem>, I>>(
    object: I,
  ): SetupItem {
    const message = createBaseSetupItem();
    message.api = object.api ?? '';
    message.hostname = object.hostname ?? '';
    message.port = object.port ?? 0;
    return message;
  },
};

function createBaseSetupRequest(): SetupRequest {
  return { secret: '', token: '', setup: undefined };
}

export const SetupRequest = {
  encode(
    message: SetupRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.secret !== '') {
      writer.uint32(10).string(message.secret);
    }
    if (message.token !== '') {
      writer.uint32(18).string(message.token);
    }
    if (message.setup !== undefined) {
      SetupItem.encode(message.setup, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetupRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetupRequest();
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
          if (tag != 18) {
            break;
          }

          message.token = reader.string();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.setup = SetupItem.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetupRequest {
    return {
      secret: isSet(object.secret) ? String(object.secret) : '',
      token: isSet(object.token) ? String(object.token) : '',
      setup: isSet(object.setup) ? SetupItem.fromJSON(object.setup) : undefined,
    };
  },

  toJSON(message: SetupRequest): unknown {
    const obj: any = {};
    message.secret !== undefined && (obj.secret = message.secret);
    message.token !== undefined && (obj.token = message.token);
    message.setup !== undefined &&
      (obj.setup = message.setup ? SetupItem.toJSON(message.setup) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<SetupRequest>, I>>(
    base?: I,
  ): SetupRequest {
    return SetupRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SetupRequest>, I>>(
    object: I,
  ): SetupRequest {
    const message = createBaseSetupRequest();
    message.secret = object.secret ?? '';
    message.token = object.token ?? '';
    message.setup =
      object.setup !== undefined && object.setup !== null
        ? SetupItem.fromPartial(object.setup)
        : undefined;
    return message;
  },
};

function createBaseSetupResponse(): SetupResponse {
  return { success: false, setup: undefined };
}

export const SetupResponse = {
  encode(
    message: SetupResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    if (message.setup !== undefined) {
      SetupItem.encode(message.setup, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetupResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetupResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.success = reader.bool();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.setup = SetupItem.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetupResponse {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      setup: isSet(object.setup) ? SetupItem.fromJSON(object.setup) : undefined,
    };
  },

  toJSON(message: SetupResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    message.setup !== undefined &&
      (obj.setup = message.setup ? SetupItem.toJSON(message.setup) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<SetupResponse>, I>>(
    base?: I,
  ): SetupResponse {
    return SetupResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SetupResponse>, I>>(
    object: I,
  ): SetupResponse {
    const message = createBaseSetupResponse();
    message.success = object.success ?? false;
    message.setup =
      object.setup !== undefined && object.setup !== null
        ? SetupItem.fromPartial(object.setup)
        : undefined;
    return message;
  },
};

export type ClientDefinition = typeof ClientDefinition;
export const ClientDefinition = {
  name: 'Client',
  fullName: 'dest.Client',
  methods: {
    deleteClient: {
      name: 'DeleteClient',
      requestType: TokenRequest,
      requestStream: false,
      responseType: SuccessResponse,
      responseStream: false,
      options: {},
    },
    getClient: {
      name: 'GetClient',
      requestType: TokenRequest,
      requestStream: false,
      responseType: SetupResponse,
      responseStream: false,
      options: {},
    },
    postClient: {
      name: 'PostClient',
      requestType: SetupRequest,
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
