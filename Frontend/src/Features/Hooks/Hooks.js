import { useContext } from "react";
import { Context } from "../Context/Context.jsx";
import { useEffect } from "react";
import { login, register, logout, verify } from "../Services/auth.api.js";

export const useAuth = () => {

    /**
    @user → logged in user
    @setUser → update user
    @loading → authentication loading state
    @setLoading → update loading
    @description this file Hooks.js Basically tracks the user's api state to update the UI or to display Loader
     */
    const { user, setUser, loading, setLoading } = useContext(Context)

    //When the app starts, check if the user is already logged in.
    useEffect(() => {
        
        setLoading(true)
        verify()
            .then(data => { if (data?.user) setUser(data.user) })
            .finally(() => setLoading(false))
    }, [])


    const loginHandler = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
        } catch (err) {
        } finally {
            setLoading(false)
        }

    }

    const registerHandler = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)

        } catch (err) {

        } finally {

            setLoading(false)
        }
    }

    const logoutHandler = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, loginHandler, registerHandler, logoutHandler }

}
