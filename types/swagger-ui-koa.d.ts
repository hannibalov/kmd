declare module "swagger-ui-koa" {
  import { Middleware } from "koa";

  interface SwaggerOptions {
    swagger: string;
    info: {
      title: string;
      version: string;
    };
    paths?: { [path: string]: any };
    [key: string]: any;
  }

  export function swaggerUi(options: SwaggerOptions): Middleware;
  export const serve: Middleware;
  export function setup(swaggerDoc: any, options?: SwaggerOptions): Middleware;
}
