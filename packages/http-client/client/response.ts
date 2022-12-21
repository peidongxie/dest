interface ResponseWrapped {
  code: number;
  message: string;
  headers: Headers;
  body: Body;
}

export { type ResponseWrapped };
