import { createContext, useState, useEffect } from "react";
import { verify } from "../Services/auth.api";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
   
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getUser = async () => {
            try {
                const data = await verify() // verifys the data through cookies from backend 
                if (data?.user) {  // ← Check if data exists before accessing .user
                    setUser(data.user)
                }
            } catch (err) {
                console.log("Auth check failed:", err)
            } finally {
                setLoading(false)  // ← Always set loading to false
            }
        }
        getUser()
    }, [])  // ← Add empty dependency array to run only once

    return(
        <Context.Provider value={{user, setUser, loading, setLoading}}>
            {children}
        </Context.Provider>
    )
};
