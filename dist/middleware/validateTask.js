"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTask = void 0;
const zod_1 = require("zod");
const taskSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Task name is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    priority: zod_1.z.enum(["Low", "Medium", "High"]),
    status: zod_1.z.enum(["To Do", "In Progress", "Completed"]),
});
const validateTask = (req, res, next) => {
    try {
        taskSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ errors: error.errors });
        }
        else {
            res.status(400).json({ message: "Invalid task data" });
        }
    }
};
exports.validateTask = validateTask;
