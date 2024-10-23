import Joi from "joi";
import Koa from "koa";
import { taskFacade } from "../facades/taskFacade";
import { ResourceNotFoundError } from "../utils/errors";

// Define validation schemas
const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
});

const updateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
});

const taskIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

// Helper function to validate payloads
async function validatePayload(
  ctx: Koa.Context,
  {
    bodySchema,
    paramsSchema,
  }: { bodySchema?: Joi.Schema; paramsSchema?: Joi.Schema }
) {
  const result: Record<string, any> = {};

  if (paramsSchema) {
    const { error, value } = paramsSchema.validate(ctx.params);
    if (error) {
      throw new Error(error.details[0].message);
    }
    result.params = value;
  }

  if (bodySchema) {
    const { error, value } = bodySchema.validate(ctx.request.body);
    if (error) {
      throw new Error(error.details[0].message);
    }
    result.body = value;
  }

  return { ...result.body, ...result.params };
}

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management operations
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 */
const getAll = async (ctx: Koa.Context) => {
  const tasks = await taskFacade.getAll();
  ctx.status = 200;
  ctx.body = tasks;
};

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Retrieve a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the task to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A task object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Task not found
 */
const get = async (ctx: Koa.Context) => {
  try {
    const payload = await validatePayload(ctx, { paramsSchema: taskIdSchema });
    const task = await taskFacade.get(payload.id);
    ctx.status = 200;
    ctx.body = task;
  } catch (e) {
    ctx.status = e instanceof ResourceNotFoundError ? 404 : 400;
    ctx.body = { error: (e as Error).message };
  }
};

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "The title of the task (required)"
 *                 example: "My Task"  # Example value for clarity
 *               description:
 *                 type: string
 *                 description: "A brief description of the task (optional)"
 *                 example: "This is a description of the task"  # Example value for clarity
 *             required:
 *               - title  # Mark title as required
 *     responses:
 *       201:
 *         description: The created task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Invalid input
 */
const create = async (ctx: Koa.Context) => {
  try {
    const payload = await validatePayload(ctx, {
      bodySchema: createTaskSchema,
    });
    const newTask = await taskFacade.create(payload);
    ctx.status = 201;
    ctx.body = newTask;
  } catch (e) {
    ctx.status = 400;
    ctx.body = { error: (e as Error).message };
  }
};

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "The ID of the task to update (required)"
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "The title of the task (required)"
 *                 example: "Updated Task"  # Example value for clarity
 *               description:
 *                 type: string
 *                 description: "A brief description of the task (optional)"
 *                 example: "Updated description of the task"  # Example value for clarity
 *             required:
 *               - title  # Mark title as required
 *     responses:
 *       200:
 *         description: The updated task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Task not found
 *       400:
 *         description: Invalid input
 */
const update = async (ctx: Koa.Context) => {
  try {
    const payload = await validatePayload(ctx, {
      bodySchema: updateSchema,
      paramsSchema: taskIdSchema,
    });
    const task = await taskFacade.update(payload);

    ctx.status = 200;
    ctx.body = task;
  } catch (e) {
    ctx.status = e instanceof ResourceNotFoundError ? 404 : 400;
    ctx.body = { error: (e as Error).message };
  }
};

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the task to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
const remove = async (ctx: Koa.Context) => {
  try {
    const payload = await validatePayload(ctx, { paramsSchema: taskIdSchema });
    const task = await taskFacade.remove(payload.id);

    ctx.status = 200;
    ctx.body = task;
  } catch (e) {
    ctx.status = e instanceof ResourceNotFoundError ? 404 : 400;
    ctx.body = { error: (e as Error).message };
  }
};

export const taskController = {
  getAll,
  get,
  create,
  update,
  remove,
};
