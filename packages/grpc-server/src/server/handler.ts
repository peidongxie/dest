import {
  type MethodDefinition,
  type handleBidiStreamingCall,
  type handleClientStreamingCall,
  type handleServerStreamingCall,
  type sendUnaryData,
} from '@grpc/grpc-js';
import {
  ObjectReadable,
  ObjectWritable,
} from '@grpc/grpc-js/src/object-stream';
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
    const getValue = <T>(source: { request: T }): T => {
      return source.request;
    };
    const setValue = <T>(target: sendUnaryData<T>) => [
      (value: Parameters<sendUnaryData<T>>[1]): void => {
        target(null, value);
      },
      (reason: Parameters<sendUnaryData<T>>[0]): void => {
        target(reason);
      },
    ];
    const getIterable = async function* <T>(
      source: ObjectReadable<T>,
    ): AsyncIterable<T> {
      for await (const request of source) {
        yield request;
      }
    };
    const setIterable = <T>(target: ObjectWritable<T>) => [
      async (value: AsyncIterable<T>): Promise<void> => {
        for await (const response of value) {
          target.write(response);
        }
        return;
      },
      async (): Promise<void> => {
        return;
      },
    ];
    if (this.type === 'Unary') {
      const implementation = this.implementation as HandlerImplementation<
        'Unary',
        Request,
        Response
      >;
      const wrappedImplementation = ((call, callback) => {
        Promise.resolve(getValue(call))
          .then((req) => implementation(req))
          .then(...setValue(callback));
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
