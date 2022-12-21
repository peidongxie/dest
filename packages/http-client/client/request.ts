import { type Blob } from 'buffer';
import { type Readable } from 'stream';
import { type ReadableStream } from 'stream/web';
import { type URLSearchParams } from 'url';

interface RequestWrapped {
  method?: string;
  url?: string | URL;
  headers?: HeadersInit;
  body?:
    | Buffer
    | ArrayBufferLike
    | ArrayBufferView
    | Blob
    | FormData
    | null
    | Readable
    | ReadableStream
    | string
    | Error
    | URLSearchParams
    | object;
  [key: symbol]: unknown;
}

export { type RequestWrapped };
