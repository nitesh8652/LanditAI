import { useContext } from "react";
import { Context } from "../Context/Context.jsx";
import { login, register, logout, verify } from "../Services/auth.api.js";

export const useAuth = () => {

    const context = useContext(Context) // Changed: Context → context
    const {user, setUser, loading, setLoading} = context // Changed: Context → context

    const loginHandler = async ({email, password}) => {
        setLoading(true)
        try{
            const data = await login({email, password})
            setUser(data.user)
        }catch(err){
        }finally{
            setLoading(false)
        }

    }

    const registerHandler = async ({username, email, password}) => {
        setLoading(true)
        try{
            const data = await register({username, email, password})
            setUser(data.user)

        }catch(err){
            
        }finally{

            setLoading(false)
        }
    }

    const logoutHandler = async () => {
        setLoading(true)
        try{
            await logout()
            setUser(null)
        }catch(err){
        }finally{
            setLoading(false)
        }
    }

    return {user, loading, loginHandler, registerHandler, logoutHandler}

}
