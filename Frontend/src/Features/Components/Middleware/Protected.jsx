import { useAuth } from "../../Hooks/Hooks.js"
import { useNavigate } from "react-router"
import { Navigate } from "react-router-dom";
import Loader from "../Ui/Loader.jsx"
import React from 'react'

const Protected = ({ children }) => {
    const { loading, user } = useAuth()

    if (loading) return <Loader />
    if (!user) return <Navigate to="/login" replace />

    return children
}

export default Protected