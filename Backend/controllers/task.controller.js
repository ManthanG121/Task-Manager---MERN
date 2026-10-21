const Task = require("../models/task.model");

const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const task = await Task.create({
            title,
            description,
            userId: req.userId
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            userId: req.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            tasks
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const task = await Task.findOne({
            _id: id,
            userId: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.status = status ?? task.status;

        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndDelete({
            _id: id,
            userId: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};