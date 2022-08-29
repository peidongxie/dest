import {
  Server as GrpcServer,
  ServerCredentials,
  type MethodDefinition,
  type UntypedHandleCall,
} from '@grpc/grpc-js';

class Server {
  private handlers: Map<
    string,
    [MethodDefinition<unknown, unknown>, UntypedHandleCall]
  >;
  private originalValue: GrpcServer;

  public constructor() {
    this.originalValue = new GrpcServer();
    this.handlers = new Map();
  }

  public async close(): Promise<GrpcServer> {
    return new Promise((resolve, reject) =>
      this.originalValue.tryShutdown((e) => {
        if (e) {
          reject(e);
        } else {
          resolve(this.originalValue);
        }
      }),
    );
  }

  public listen(port?: number, hostname?: string): Promise<GrpcServer> {
    return new Promise((resolve, reject) =>
      this.originalValue.bindAsync(
        `${hostname || 'localhost'}:${port || 0}`,
        ServerCredentials.createInsecure(),
        (e) => {
          if (e) {
            reject(e);
          } else {
            this.originalValue.start();
            resolve(this.originalValue);
          }
        },
      ),
    );
  }

  public use(
    definition: MethodDefinition<unknown, unknown>,
    implementation: UntypedHandleCall,
  ): void {
    this.handlers.set(definition.path, [definition, implementation]);
  }
}

export { Server as default };
