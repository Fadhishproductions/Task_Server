import type { Request, Response, NextFunction } from "express"
import { z } from "zod"

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["To Do", "In Progress", "Completed"]),
})

export const validateTask = (req: Request, res: Response, next: NextFunction) => {
   try {
     taskSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors })
    } else {
      res.status(400).json({ message: "Invalid task data" })
    }
  }
}

