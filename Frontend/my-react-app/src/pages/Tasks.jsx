
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

const Tasks = () => {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);

    const [taskData, setTaskData] = useState({
        title: "",
        description: ""
    });

    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");

    // Get Tasks
    const getTasks = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTasks(response.data.tasks || []);
        } catch (error) {
            console.log(
                "GET TASK ERROR:",
                error.response?.data || error.message
            );
        }
    };

    // Input Change
    const handleChange = (e) => {
        setTaskData({
            ...taskData,
            [e.target.name]: e.target.value
        });
    };

    // Create / Update Task
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            if (editId) {
                // Update Task
                await axios.put(
                    `${API_URL}/${editId}`,
                    taskData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Task updated successfully");
                setEditId(null);
            } else {
                // Create Task
                await axios.post(API_URL, taskData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                alert("Task created successfully");
            }

            // Clear Form
            setTaskData({
                title: "",
                description: ""
            });

            // Refresh Tasks
            await getTasks();
        } catch (error) {
            console.log(error.response?.data || error.message);

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    // Start Edit
    const handleEdit = (task) => {
        setEditId(task._id);

        setTaskData({
            title: task.title,
            description: task.description || ""
        });
    };

    // Cancel Edit
    const cancelEdit = () => {
        setEditId(null);

        setTaskData({
            title: "",
            description: ""
        });
    };

    // Delete Task
    const deleteTask = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Task deleted successfully");

            await getTasks();
        } catch (error) {
            console.log(error.response?.data || error.message);

            alert(
                error.response?.data?.message ||
                "Task deletion failed"
            );
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    // Search Tasks by Title
    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
    );

    // Update Task Status
    const updateTaskStatus = async (task) => {
        try {
            const token = localStorage.getItem("token");

            const newStatus =
                task.status === "Completed"
                    ? "Pending"
                    : "Completed";

            await axios.put(
                `${API_URL}/${task._id}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await getTasks();
        } catch (error) {
            console.log(
                "STATUS UPDATE ERROR:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Status update failed"
            );
        }
    };

    // Fetch Tasks on Page Load
    useEffect(() => {
        getTasks();
    }, []);

    return (
        <div>
            <h1>My Tasks</h1>

            <button onClick={handleLogout}>
                Logout
            </button>

            <hr />

            {/* Create / Edit Form */}
            <h2>{editId ? "Edit Task" : "Create Task"}</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Task title"
                    value={taskData.title}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <textarea
                    name="description"
                    placeholder="Task description"
                    value={taskData.description}
                    onChange={handleChange}
                />

                <br /><br />

                <button type="submit">
                    {editId ? "Update Task" : "Add Task"}
                </button>

                {editId && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <hr />

            {/* Search Tasks */}
            <h2>Search Tasks</h2>

            <input
                type="text"
                placeholder="Search tasks by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <hr />

            {/* Task List */}
            <h2>My Task List</h2>

            {filteredTasks.length === 0 ? (
                <p>
                    {search
                        ? "No matching tasks found"
                        : "No tasks found"}
                </p>
            ) : (
                filteredTasks.map((task) => (
                    <div key={task._id}>
                        <h3>{task.title}</h3>

                        <p>
                            {task.description || "No description"}
                        </p>

                        <p>
                            Status: {task.status}
                        </p>

                        <button
                            onClick={() => handleEdit(task)}
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => deleteTask(task._id)}
                        >
                            Delete
                        </button>

                        <button
                            onClick={() => updateTaskStatus(task)}
                        >
                            {task.status === "Completed"
                                ? "Mark as Pending"
                                : "Mark as Completed"}
                        </button>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
};

export default Tasks;