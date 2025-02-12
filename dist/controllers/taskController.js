"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5; // Default: 5 tasks per page
        const search = req.query.search;
        const skip = (page - 1) * limit;
        const query = {};
        if (search) {
            query.name = { $regex: search, $options: "i" }; // Case-insensitive search
        }
        const tasks = yield Task_1.default.find(query).skip(skip).limit(limit);
        const totalTasks = yield Task_1.default.countDocuments(query);
        res.json({
            tasks,
            totalTasks,
            totalPages: Math.ceil(totalTasks / limit),
            currentPage: page,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching tasks" });
    }
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Creating task:", req.body);
        const task = new Task_1.default(req.body);
        yield task.save();
        res.status(201).json(task);
    }
    catch (error) {
        console.error("Error creating task:", error);
        // Handle Mongoose Validation Errors
        if (error.name === "ValidationError") {
            res.status(400).json({ message: "Validation Error", errors: error.errors });
            return;
        }
        // Handle Duplicate Key Errors
        if (error.code === 11000) {
            res.status(400).json({ message: "Duplicate Key Error", error });
            return;
        }
        // Generic Error Handling
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("this is update task");
        const task = yield Task_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.status(200).json(task);
    }
    catch (error) {
        res.status(400).json({ message: "Error updating task" });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.default.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ message: "Error deleting task" });
    }
});
exports.deleteTask = deleteTask;
