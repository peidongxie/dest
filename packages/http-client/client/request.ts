interface PluginRequest {
  method?: string;
  url?: string | URL;
  headers?: HeadersInit;
  body?: BodyInit | null;
}

export { type PluginRequest };
