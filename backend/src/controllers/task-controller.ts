import { Request, Response } from "express";
import { AuthRequest } from "../middleware";
import Task from "../models/task-model";
import { ITask } from "../types";

export const getAllTasks = async (request: AuthRequest, response: Response) => {
  try {
    const userId = request.user;

    const tasks = await Task.find({
      user: userId,
    });

    response.send(tasks);
  } catch (err) {
    console.log("error in get all tasks", err);
    response.send({ err: "Error while fetching tasks" });
    throw err;
  }
};

export const getAllTasksByCategory = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const userId = request.user;
    const { id } = request.params;
    const tasks = await Task.find({
      user: userId,
      categoryId: id,
    });
    response.send(tasks);
  } catch (error) {
    console.log("error in get all tasks by category", error);
    response.send({ error: "Error while fetching tasks" });
    throw error;
  }
};

export const getAllCompletedTasks = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const userId = request.user;
    const tasks = await Task.find({
      user: userId,
      isCompleted: true,
    });
    response.send(tasks);
  } catch (error) {
    console.log("error in get all completed tasks", error);
    throw error;
  }
};

export const getTasksForToday = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const userId = request.user;
    const todaysISODate = new Date();
    todaysISODate.setHours(0, 0, 0, 0);
    const tasks = await Task.find({
      user: userId,
      date: todaysISODate.toISOString(),
    });
    response.send(tasks);
  } catch (error) {
    console.log("error in get tasks for today", error);
    throw error;
  }
};
export const createTask = async (request: AuthRequest, response: Response) => {
  try {
    const userId = request.user;
    const { name, date, categoryId }: ITask = request.body;

    const task = await Task.create({
      name,
      date,
      categoryId,
      user: userId,
    });
    response.send(task);
  } catch (err) {
    console.log("error creating task", err);
    response.send({ err: "Error while creating task" });
    throw err;
  }
};

export const toggleTaskStatus = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { isCompleted } = request.body;
    const { id } = request.params;

    const task = await Task.updateOne(
      {
        _id: id,
      },
      isCompleted
    );
    response.send({ message: "Task status updates" });
  } catch (err) {
    console.log("error in toggle task statues", err);
    response.send({ err: "Error while toggling statues task" });

    throw err;
  }
};

export const deleteTask = async (request: AuthRequest, response: Response) => {
  try {
    const { id } = request.params;
    await Task.deleteOne({
      _id: id,
    });
    response.send({ message: "Task deleted" });
  } catch (error) {
    console.log("error in deleting task", error);
    response.send({ error: "Error while deleting task" });
    throw error;
  }
};

export const editTask = async (request: AuthRequest, response: Response) => {
  try {
    const { _id, categoryId, date, name }: ITask = request.body;
    await Task.updateOne(
      {
        _id,
      },
      {
        $set: {
          name,
          categoryId,
          date,
        },
      }
    );
    response.send({ message: "Task updated successfully" });
  } catch (error) {
    console.log("error in editing task", error);
    response.send({ error: "Failed to update the task" });
    throw error;
  }
};
