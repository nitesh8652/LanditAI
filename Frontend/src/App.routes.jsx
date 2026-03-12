import { createBrowserRouter } from "react-router";
import Login from "./Features/Pages/Login.jsx";
import Register from "./Features/Pages/Register.jsx";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />

    },
    {
        path: "/register",
        element: <Register />

        ,
    }
])