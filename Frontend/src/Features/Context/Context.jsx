import { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
   
    
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    return(
        <Context.Provider value={{user, setUser, loading, setLoading}}>
            {children}
        </Context.Provider>
    )

};