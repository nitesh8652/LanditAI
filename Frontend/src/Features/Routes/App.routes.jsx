import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login.jsx";
import Register from "../Pages/Register.jsx";
import ResumeBuilder from "../Pages/ResumeBuilder.jsx";
import Protected from "../Components/Middleware/Protected.jsx";
import Home from "../Interview Report/Pages/Home.jsx"


/**
 @description helps to render components
 */
export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />

    },
    {
        path: "/register",
        element: <Register />

    },

    //<Protected> is the middleware where it checks if the user is logged in or not
    {
        path: "/features",
        element:
            <Protected>
                <ResumeBuilder />
                <Home/>
            </Protected>
    }
])