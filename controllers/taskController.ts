import type { Request, Response } from "express"
import Task, { type ITask } from "../models/Task"

export const getTasks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5; // Default: 5 tasks per page
    const search = req.query.search as string | undefined;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    const tasks = await Task.find(query).skip(skip).limit(limit);
    const totalTasks = await Task.countDocuments(query);

    res.json({
      tasks,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};



export const createTask = async (req: Request, res: Response) : Promise<void> => {
  try {
    console.log("Creating task:", req.body);

    const task: ITask = new Task(req.body);
    await task.save();

    res.status(201).json(task);
  } catch (error: any) {
    console.error("Error creating task:", error);

    // Handle Mongoose Validation Errors
    if (error.name === "ValidationError") {
       res.status(400).json({ message: "Validation Error", errors: error.errors });
       return
    }

    // Handle Duplicate Key Errors
    if (error.code === 11000) {
       res.status(400).json({ message: "Duplicate Key Error", error });
       return
    }

    // Generic Error Handling
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};


export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("this is update task")

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    } 

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: "Error updating task" });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting task" });
  }
};