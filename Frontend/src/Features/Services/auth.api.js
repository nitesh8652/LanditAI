import axios from "axios";


/**
 @Purpose reuseable api calls
 @description made an instance of axios to make api calls to the backend so that it would be easier to only write the last part of the url eg - /register, /logout instead of writing http://localhost:3000/api/auth/register repeatedlyin all the components
 */
const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
})


/**
 * @Purpose register a new user
 * @description register, login, logout new user, excepts username, email and password in the request body and send's them to the backend
 */
export async function register({ username, email, password }) {

    try {
        const response = await api.post("/register", {
            username,
            email,
            password,
        });
        return response.data;
    }
    catch (err) {
        console.log(err)
    }
}

export async function login({ email, password }) {

    try {
        const response = await api.post("/login", {
            email,
            password,
        });
        return response.data;
    }
    catch (err) {
        console.log(err)
    }

}

export async function logout() {

    try {
        const response = await api.get("/logout");
        return response.data;
    } catch (err) {
        console.log(err)
    }
}

/**
 @purpose Checks if the user session is still valid
 @description checks  JWT cookie
                      if valid → return user
                      if invalid → return null
 */
export async function verify() {
    
    try {    
        const response = await api.get("/verify");
        return response.data;
    } catch (err) {
        console.log(err) 
    }
}
