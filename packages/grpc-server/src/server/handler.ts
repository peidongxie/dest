import {
  type MethodDefinition,
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
} from '@grpc/grpc-js';
import { type Definition, type Implementation, type RpcType } from './server';

type HandlerDefinition<Type extends RpcType, Request, Response> = Omit<
  MethodDefinition<Request, Response>,
  'requestStream' | 'responseStream'
> & {
  requestStream?: Type extends 'Unary'
    ? false
    : Type extends 'ServerStreaming'
    ? false
    : Type extends 'ClientStreaming'
    ? true
    : Type extends 'BidiStreaming'
    ? true
    : never;
  responseStream?: Type extends 'Unary'
    ? false
    : Type extends 'ServerStreaming'
    ? true
    : Type extends 'ClientStreaming'
    ? false
    : Type extends 'BidiStreaming'
    ? true
    : never;
};

type HandlerImplementation<
  Type extends RpcType,
  Request,
  Response,
> = Type extends 'Unary'
  ? (req: Request) => Response | Promise<Response>
  : Type extends 'ServerStreaming'
  ? handleServerStreamingCall<Request, Response>
  : Type extends 'ClientStreaming'
  ? handleClientStreamingCall<Request, Response>
  : Type extends 'BidiStreaming'
  ? handleBidiStreamingCall<Request, Response>
  : never;

class Handler<Type extends RpcType, Request, Response> {
  type: Type;
  definition: HandlerDefinition<RpcType, Request, Response>;
  implementation: HandlerImplementation<Type, Request, Response>;

  constructor(
    type: Type,
    definition: HandlerDefinition<RpcType, Request, Response>,
    implementation: HandlerImplementation<Type, Request, Response>,
  ) {
    this.type = type;
    this.definition = definition;
    this.implementation = implementation;
  }

  getPath(): string {
    return this.definition.path;
  }

  wrapDefinition(): Definition<Type, Request, Response> {
    const definition = this.definition;
    const wrappedDefinition: Definition<Type, Request, Response> = {
      requestStream:
        this.type === 'ClientStreaming' || this.type === 'BidiStreaming',
      responseStream:
        this.type === 'ServerStreaming' || this.type === 'BidiStreaming',
      ...definition,
    };
    return wrappedDefinition;
  }

  wrapImplementation(): Implementation<Type, Request, Response> {
    if (this.type === 'Unary') {
      const implementation = this.implementation as HandlerImplementation<
        'Unary',
        Request,
        Response
      >;
      const wrappedImplementation = (async (call, callback) => {
        try {
          const value = await implementation(call.request);
          callback(null, value);
        } catch (error) {
          callback(error as Parameters<typeof callback>[0]);
          throw error;
        }
      }) as Implementation<'Unary', Request, Response>;
      return wrappedImplementation as Implementation<Type, Request, Response>;
    }
    throw new TypeError('Bad handler type');
  }
}

export {
  Handler as default,
  type HandlerDefinition,
  type HandlerImplementation,
};
