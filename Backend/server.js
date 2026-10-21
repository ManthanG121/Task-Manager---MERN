require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.routes.js");
const taskRoutes = require("./routes/task.routes");

const app = express();
require("node:dns/promises").setServers(["1.1.1.1","8.8.8.8"])

connectDB();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Task Manager API is running");
});
app.use("/api",authRoutes)
app.use("/api", taskRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});