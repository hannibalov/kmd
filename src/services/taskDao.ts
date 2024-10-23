import { Task } from "../models/task";
import { ResourceNotFoundError, errorMessages } from "../utils/errors";

let nextId = 1;

// In-memory storage for tasks. They are asynchronous to simulate a real database.
const tasks: { [key: number]: Task } = {};

const create = async (task: Omit<Task, "id">) => {
  const savedTask = { ...task, id: nextId++ };
  tasks[savedTask.id] = savedTask;
  return savedTask;
};

const get = async (id: number) => {
  if (!tasks[id])
    throw new ResourceNotFoundError(errorMessages.RESOURCE_NOT_FOUND("Task"));

  return tasks[id];
};

const getAll = async () => {
  return Object.values(tasks);
};

const update = async (task: Task) => {
  if (!tasks[task.id])
    throw new ResourceNotFoundError(errorMessages.RESOURCE_NOT_FOUND("Task"));

  // In a DB such as PostgreSQL the updatedAt can be automatically set through triggers
  tasks[task.id] = { ...tasks[task.id], ...task, updatedAt: new Date() };
  return tasks[task.id];
};

const remove = async (id: number) => {
  if (!tasks[id])
    throw new ResourceNotFoundError(errorMessages.RESOURCE_NOT_FOUND("Task"));

  const deletedTask = tasks[id];
  delete tasks[id];

  return deletedTask;
};

export const taskDao = {
  create,
  get,
  getAll,
  update,
  remove,
};
