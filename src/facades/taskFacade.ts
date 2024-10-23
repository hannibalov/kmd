import { taskFactory } from "../factories/taskFactory";
import { Task } from "../models/task";
import { taskDao } from "../services/taskDao";
import { errorMessages } from "../utils/errors";

export async function get(id: number) {
  return await taskDao.get(id);
}

export async function getAll() {
  return await taskDao.getAll();
}

export async function create(task: Omit<Task, "id">) {
  if (!task.title) {
    throw new Error(errorMessages.PARAMETER_MISSING("title"));
  }
  const createdTask = taskFactory(task);

  const newTask = await taskDao.create(createdTask);

  return newTask;
}

export async function update(task: Task) {
  if (!task.title || !task.description) {
    throw new Error(errorMessages.PARAMETER_MISSING("title"));
  }
  return await taskDao.update(task);
}

export async function remove(id: number) {
  return await taskDao.remove(id);
}

export const taskFacade = {
  create,
  getAll,
  get,
  update,
  remove,
};
