interface ResponseWrapped {
  code: number;
  message: string;
  headers: Headers;
  body: Body;
  [key: symbol]: unknown;
}

export { type ResponseWrapped };
