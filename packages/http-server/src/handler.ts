import type Request from './request';
import type Response from './response';
interface HandlerRequest {
  getMethod: Request['getMethod'];
  getUrl: Request['getUrl'];
  getHeaders: Request['getHeaders'];
  getBody: Request['getBody'];
}

interface HandlerResponse {
  code?: Parameters<Response['setCode']>[0];
  message?: Parameters<Response['setMessage']>[0];
  headers?: Parameters<Response['setHeaders']>[0];
  body?: Parameters<Response['setBody']>[0];
}

type Handler = (
  req: HandlerRequest,
) => void | HandlerResponse | Promise<void | HandlerResponse>;

const defaultHandler: Handler = () => {
  return { code: 404 };
};

export {
  defaultHandler as default,
  type Handler,
  type HandlerRequest,
  type HandlerResponse,
};
