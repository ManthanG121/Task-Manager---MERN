import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import ProtectedRoute from "../components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Default route */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                {/* Login page */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Register page */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Protected Tasks page */}
                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <Tasks />
                        </ProtectedRoute>
                    }
                />

                {/* Unknown URL */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;