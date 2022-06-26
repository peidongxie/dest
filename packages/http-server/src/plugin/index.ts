import Cors from './cors';
import Router from './cors';
import { type HttpType } from '../server';
import { type Handler } from '../handler';

interface Plugin<T extends HttpType = 'HTTP'> {
  getHandler(): Handler<T>;
}

export { Cors, Router, type Plugin };
