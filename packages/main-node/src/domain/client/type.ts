import { type EntitySchemaOptions } from 'typeorm';
import {
  type ContextEnvironment,
  type ContextEvent,
  type ContextLevel,
  type ContextResult,
  type ContextType,
} from '../context';

interface Client {
  deleteAgent: (secret: string) => Promise<{
    success: boolean;
    token: string;
  }>;
  deleteDatabase: (
    type: ContextType,
    name: string,
  ) => Promise<{
    success: boolean;
  }>;
  getAgent: (secret: string) => Promise<{
    success: boolean;
    token: string;
  }>;
  getDatabase: (
    type: ContextType,
    name: string,
  ) => Promise<{
    success: boolean;
  }>;
  getHierarchy: (
    type: ContextType | '',
    name: string,
    table: string,
    level: ContextLevel,
  ) => Promise<{
    success: boolean;
    environments: ContextEnvironment[];
  }>;
  postAgent: (secret: string) => Promise<{
    success: boolean;
    token: string;
  }>;
  postDatabase: (
    type: ContextType,
    name: string,
    schemas: EntitySchemaOptions<unknown>[],
  ) => Promise<{
    success: boolean;
  }>;
  postQuery: <T>(
    type: ContextType,
    name: string,
    event: ContextEvent<unknown>,
  ) => Promise<{
    success: boolean;
    result: ContextResult<T>;
  }>;
}

export { type Client };
