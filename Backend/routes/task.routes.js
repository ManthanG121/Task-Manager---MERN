const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth");

const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require("../controllers/task.controller");

router.post("/tasks", authMiddleware, createTask);

router.get("/tasks", authMiddleware, getTasks);

router.put("/tasks/:id", authMiddleware, updateTask);

router.delete("/tasks/:id", authMiddleware, deleteTask);

module.exports = router;