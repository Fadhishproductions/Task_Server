import express from "express"
 import { validateTask } from "../middleware/validateTask"
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/taskController"

const router = express.Router()

router.get("/tasks", getTasks)
router.post("/tasks", validateTask, createTask)
router.put("/tasks/:id", validateTask, updateTask)
router.delete("/tasks/:id", deleteTask)

export default router

