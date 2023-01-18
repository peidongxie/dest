import {
  type ContextEventItem,
  type ContextResultItem,
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
    results: ContextResultItem<unknown>[];
  }>;
  postAgent: (secret: string) => Promise<{
    success: boolean;
    token: string;
  }>;
  postDatabase: (
    type: ContextType,
    name: string,
    schemas: unknown[],
  ) => Promise<{
    success: boolean;
  }>;
  postQuery: <T>(
    type: ContextType,
    name: string,
    event: ContextEventItem<unknown>,
  ) => Promise<{
    success: boolean;
    result: ContextResultItem<T>;
  }>;
}

export { type Client };
