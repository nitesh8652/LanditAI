import { createBrowserRouter } from "react-router";
import Login from "../Pages/Login.jsx";
import Register from "../Pages/Register.jsx";
import ResumeBuilder from "../Pages/ResumeBuilder.jsx";
import Protected from "../Components/Middleware/Protected.jsx";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />

    },
    {
        path: "/register",
        element: <Register />

    },
    {
        path:"/features",
        element:
        (<protected><ResumeBuilder /></protected>)
    }
])