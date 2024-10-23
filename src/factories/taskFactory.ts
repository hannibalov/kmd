import { Task } from "../models/task";

export const taskFactory = (
  overrides: Partial<Task> = {}
): Omit<Task, "id"> => {
  const now = new Date();
  return {
    title: `Task title`,
    description: `Description`,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};
