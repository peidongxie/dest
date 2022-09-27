import { type Plugin, type PluginHandler } from '../../server';

interface AllowOptions {
  headers?: string;
  methods?: string;
  origin?: (origin: string) => boolean;
}

type AddPrefix<Prefix extends string, Type> = {
  [Key in keyof Type as `${Prefix}${Capitalize<string & Key>}`]: Type[Key];
};

interface Options extends AddPrefix<'allow', AllowOptions> {
  maxAge?: number;
}

const defaultOptions = {
  allowOptions: {
    headers: '*',
    methods: '*',
    origin: () => true,
  },
  maxAge: 600,
};

class Cors implements Plugin {
  private allowOptions: Required<AllowOptions>;
  private enable: boolean;
  private maxAge: number;

  public constructor(options?: Options | boolean) {
    this.enable = options !== false;
    if (options === true || options === false || options == undefined) {
      this.allowOptions = defaultOptions.allowOptions;
      this.maxAge = defaultOptions.maxAge;
    } else {
      this.allowOptions = {
        headers: options.allowHeaders || defaultOptions.allowOptions.headers,
        methods: options.allowMethods || defaultOptions.allowOptions.methods,
        origin: options.allowOrigin || defaultOptions.allowOptions.origin,
      };
      this.maxAge = options.maxAge || defaultOptions.maxAge;
    }
  }

  public getHandler(): PluginHandler {
    return (req) => {
      const { method, headers } = req;
      const origin = headers.origin;
      // not cors
      if (!this.enable || origin === undefined) {
        return {};
      }
      // forbidden
      if (!this.allowOptions.origin(origin as string)) {
        return {
          code: 403,
          body: null,
        };
      }
      // preflight
      if (method === 'OPTIONS') {
        return {
          code: 204,
          headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': this.allowOptions.headers,
            'Access-Control-Allow-Methods': this.allowOptions.methods,
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Max-Age': this.maxAge,
          },
          body: null,
        };
      }
      // cors
      return {
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': origin,
        },
      };
    };
  }

  public setAllowOptions(allowOptions: AllowOptions): void {
    this.allowOptions = {
      ...this.allowOptions,
      ...allowOptions,
    };
  }

  public setEnable(enable: boolean): void {
    this.enable = enable;
  }

  public setMaxAge(maxAge: number): void {
    this.maxAge = maxAge;
  }
}

export { Cors as default };
