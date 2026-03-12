import { RouterProvider } from "react-router"
import { router } from "./App.routes.jsx"
import { BrowserRouter, Routes, Route } from "react-router"
import Login from "./Features/Pages/Login.jsx"
import Register from "./Features/Pages/Register.jsx"
import Hero from "./Features/Pages/Hero.jsx"

function App() {


  return (
    <>
      <div className="min-h-screen bg-[#0A0A0A]">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
