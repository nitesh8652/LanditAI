import { useAuth } from "../../Hooks/Hooks.js"
import { useNavigate } from "react-router"
import Loader from "../../Components/Loader.jsx"
import React from 'react'

const Protected = (children) => {

    const { loading, user } = useAuth()
    const navigate = useNavigate()

    if (loading) {
        return <Loader />
    }

    if (!user) {
         return <navigate to="/login" replace />;
    }

    return children
}

export default Protected