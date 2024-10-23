import { taskFacade } from "../facades/taskFacade";
import { ResourceNotFoundError } from "../utils/errors";
import { taskController } from "./taskController";

describe("getAll", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      status: 0,
      body: null,
    };
  });

  it("should return all tasks successfully", async () => {
    // Mock taskFacade's getAll method to return a list of tasks
    const tasks = [
      { id: 1, title: "Task 1", description: "Description 1" },
      { id: 2, title: "Task 2", description: "Description 2" },
    ];
    taskFacade.getAll = jest.fn().mockResolvedValue(tasks);

    // Call the controller
    await taskController.getAll(ctx);

    // Assertions
    expect(taskFacade.getAll).toHaveBeenCalled();
    expect(ctx.status).toBe(200);
    expect(ctx.body).toEqual(tasks);
  });

  it("should return an empty list if no tasks exist", async () => {
    // Mock taskFacade's getAll method to return an empty list
    taskFacade.getAll = jest.fn().mockResolvedValue([]);

    // Call the controller
    await taskController.getAll(ctx);

    // Assertions
    expect(taskFacade.getAll).toHaveBeenCalled();
    expect(ctx.status).toBe(200);
    expect(ctx.body).toEqual([]);
  });
});

describe("getTask", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      params: {},
      request: { body: {} },
      status: 0,
      body: null,
    };
  });

  it("should return a task successfully", async () => {
    // Mock params for valid task ID
    ctx.params.id = 1;

    // Mock taskFacade's get method to return a task
    const task = { id: 1, title: "Task 1", description: "Task Description" };
    taskFacade.get = jest.fn().mockResolvedValue(task);

    // Call the controller
    await taskController.get(ctx);

    // Assertions
    expect(taskFacade.get).toHaveBeenCalled();
    expect(ctx.status).toBe(200);
    expect(ctx.body).toEqual(task);
  });

  it("should return 404 if the task is not found", async () => {
    // Mock params for a non-existent task ID
    ctx.params.id = 999;

    // Mock taskFacade's get method to throw ResourceNotFoundError
    taskFacade.get = jest
      .fn()
      .mockRejectedValue(new ResourceNotFoundError("Task not found"));

    // Call the controller
    await taskController.get(ctx);

    // Assertions
    expect(ctx.status).toBe(404);
    expect(ctx.body).toEqual({ error: "Task not found" });
  });

  it("should return 400 if validation fails", async () => {
    // Mock invalid params (non-numeric ID)
    ctx.params.id = "invalid";

    // Call the controller
    await taskController.get(ctx);

    // Assertions
    expect(ctx.status).toBe(400);
    expect(ctx.body).toHaveProperty("error");
  });
});

describe("updateTask", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      params: {},
      request: { body: {} },
      status: 0,
      body: null,
    };
  });

  it("should update a task successfully", async () => {
    ctx.params.id = 1;
    ctx.request.body = {
      title: "Updated Title",
      description: "Updated Description",
    };

    const task = {
      id: 1,
      title: "Updated Title",
      description: "Updated Description",
    };
    taskFacade.update = jest.fn().mockResolvedValue(task);

    await taskController.update(ctx);

    expect(ctx.status).toBe(200);
    expect(ctx.body).toEqual(task);
  });

  it("should return 404 if task is not found", async () => {
    ctx.params.id = 999;
    ctx.request.body = {
      title: "Updated Title",
      description: "Updated Description",
    };

    taskFacade.update = jest
      .fn()
      .mockRejectedValue(new ResourceNotFoundError("Task not found"));

    await taskController.update(ctx);

    expect(ctx.status).toBe(404);
    expect(ctx.body).toEqual({ error: "Task not found" });
  });

  it("should return 400 if id not validated", async () => {
    ctx.params.id = "invalid";
    ctx.request.body = {
      title: "Updated Title",
      description: "Updated Description",
    };

    await taskController.update(ctx);

    expect(ctx.status).toBe(400);
    expect(ctx.body).toHaveProperty("error");
  });

  it("should return 400 if no title", async () => {
    ctx.params.id = 1;
    ctx.request.body = {
      description: "Updated Description",
    };

    await taskController.update(ctx);

    expect(ctx.status).toBe(400);
    expect(ctx.body).toHaveProperty("error");
    expect(ctx.body.error).toBe('"title" is required');
  });
});

describe("createTask", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      params: {},
      request: { body: {} },
      status: 0,
      body: null,
    };
  });

  it("should create a task successfully", async () => {
    ctx.request.body = {
      title: "New Task",
      description: "New Description",
    };

    const newTask = {
      id: 1,
      title: "New Task",
      description: "New Description",
    };
    taskFacade.create = jest.fn().mockResolvedValue(newTask);

    await taskController.create(ctx);

    expect(ctx.status).toBe(201);
    expect(ctx.body).toEqual(newTask);
  });

  it("should return 400 if validation fails", async () => {
    ctx.request.body = {
      description: "New Description",
    };

    await taskController.create(ctx);

    expect(ctx.status).toBe(400);
    expect(ctx.body).toHaveProperty("error");
    expect(ctx.body.error).toBe('"title" is required');
  });
});

describe("removeTask", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      params: {},
      request: { body: {} },
      status: 0,
      body: null,
    };
  });

  it("should remove a task successfully", async () => {
    ctx.params.id = 1;

    const task = {
      id: 1,
      title: "Task to be removed",
      description: "Description",
    };
    taskFacade.remove = jest.fn().mockResolvedValue(task);

    await taskController.remove(ctx);

    expect(ctx.status).toBe(200);
    expect(ctx.body).toEqual(task);
  });

  it("should return 404 if task is not found", async () => {
    ctx.params.id = 999;

    taskFacade.remove = jest
      .fn()
      .mockRejectedValue(new ResourceNotFoundError("Task not found"));

    await taskController.remove(ctx);

    expect(ctx.status).toBe(404);
    expect(ctx.body).toEqual({ error: "Task not found" });
  });

  it("should return 400 if validation fails", async () => {
    ctx.params.id = "invalid";

    await taskController.remove(ctx);

    expect(ctx.status).toBe(400);
    expect(ctx.body).toHaveProperty("error");
  });
});
