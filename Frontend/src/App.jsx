import { RouterProvider } from "react-router"
import { router } from "./Features/Routes/App.routes.jsx"
import { BrowserRouter, Routes, Route } from "react-router"
import Login from "./Features/Pages/Login.jsx"
import Register from "./Features/Pages/Register.jsx"
import Hero from "./Features/Pages/Hero.jsx"
import ResumeBuilder from "./Features/Pages/ResumeBuilder.jsx"
import { ContextProvider } from "./Features/Context/Context.jsx"

function App() {


  return (
    <>
      <ContextProvider>
        <div className="min-h-screen bg-[#0A0A0A]">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/ResumeBuilder" element={<ResumeBuilder />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ContextProvider>
    </>
  )
}

export default App
