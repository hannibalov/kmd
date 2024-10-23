import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-body";
import { withTransaction } from "./middleware/middleware";
import { taskController } from "./controllers/taskController";
import swaggerUi from "swagger-ui-koa";
import swaggerSpec from "../swaggerConfig";

const app = new Koa();
const router = new Router();

// Middleware for parsing request bodies
app.use(bodyParser());

// Define routes with the transaction middleware
router.get("/tasks/:id", withTransaction, taskController.get);
router.get("/tasks", withTransaction, taskController.getAll);
router.post("/tasks", withTransaction, taskController.create);
router.put("/tasks/:id", withTransaction, taskController.update);
router.delete("/tasks/:id", withTransaction, taskController.remove);

// Serve Swagger docs at /docs
router.get("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve Swagger UI assets at /swagger-ui
app.use(async (ctx, next) => {
  if (ctx.path.startsWith("/swagger-ui")) {
    ctx.set("Cache-Control", "max-age=3600");
    await swaggerUi.serve(ctx, next);
  } else {
    await next();
  }
});

// Use the defined routes
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.BACKEND_PORT || 3001;
app.listen(port, () => {
  console.log(`Koa server running on port ${port}`);
});
