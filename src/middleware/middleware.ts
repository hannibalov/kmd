import Koa from "koa";

// Middleware to handle transactions
export async function withTransaction(
  ctx: Koa.Context,
  next: () => Promise<any>
) {
  try {
    // we would normally use a DB transaction here
    return await next();
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: (error as Error).message };
  }
}
