/**
 * @file Hooks.js
 * @description Custom `useAuth` hook — the single point of truth for all
 * authentication actions (login, register, logout) in UI components.
 *
 * Auth STATE is owned by Context.jsx (which calls verify() on mount).
 * This hook exposes that state plus the action handlers; it does NOT
 * call verify() again to avoid a double network request race condition.
 */

import { useContext } from "react";
import { Context } from "../Context/Context.jsx";
import { login, register, logout } from "../Services/Auth.api.js"
import { googleLogin } from "../Services/Firebase.js";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../Services/Firebase"

/**
 * @hook useAuth
 * @returns {{
 *   user:            object|null,
 *   loading:         boolean,
 *   loginHandler:    (credentials: {email: string, password: string}) => Promise<void>,
 *   registerHandler: (credentials: {username: string, email: string, password: string}) => Promise<void>,
 *   logoutHandler:   () => Promise<void>,
 * }}
 */
export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(Context);

  /**
   * @function loginHandler
   * @description Calls the login API and updates global user state on success.
   * @param {object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   */
  const loginHandler = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      if (data?.user) setUser(data.user);
    } catch (err) {
      console.error("Login failed:", err);
      throw err; // re-throw so the calling component can show an error
    } finally {
      setLoading(false);
    }
  };

  /**
   * @function registerHandler
   * @description Calls the register API and updates global user state on success.
   * @param {object} credentials
   * @param {string} credentials.username
   * @param {string} credentials.email
   * @param {string} credentials.password
   */
  const registerHandler = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      if (data?.user) setUser(data.user);
    } catch (err) {
      console.error("Register failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * @function logoutHandler
   * @description Calls the logout API (blacklists the JWT, clears cookie)
   * and nullifies the global user state.
   */
  const logoutHandler = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };


  /**
   * @function handleGoogleLogin
   * @description backend, then updates global auth state with the returned MongoDB user On failure, the error bubbles up to the calling component (Login.jsx).
   */

  const googleLoginHandler = async () => {
    setLoading(true)
    try {
      const data = await googleLogin() //backend call
      if (data?.user) setUser(data.user);

    } catch (err) {
      console.error("Google login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }

  }


  return { user, loading, loginHandler, registerHandler, logoutHandler, googleLoginHandler };
};