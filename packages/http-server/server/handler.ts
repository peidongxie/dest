import type Request from './request';
import type Response from './response';
import { type HttpType } from './server';

interface HandlerRequest<T extends HttpType = 'HTTP'> {
  method: ReturnType<Request<T>['getMethod']>;
  url: ReturnType<Request<T>['getUrl']>;
  headers: ReturnType<Request<T>['getHeaders']>;
  body: ReturnType<Request<T>['getBody']>;
}

interface HandlerResponse<T extends HttpType = 'HTTP'> {
  code?: Parameters<Response<T>['setCode']>[0];
  message?: Parameters<Response<T>['setMessage']>[0];
  headers?: Parameters<Response<T>['setHeaders']>[0];
  body?: Parameters<Response<T>['setBody']>[0];
}

type Handler<T extends HttpType = 'HTTP'> = (
  req: HandlerRequest<T>,
) => void | HandlerResponse<T> | Promise<void | HandlerResponse<T>>;

interface Plugin<T extends HttpType = 'HTTP'> {
  getHandler(): Handler<T>;
}

export { type Handler, type HandlerRequest, type HandlerResponse, type Plugin };
