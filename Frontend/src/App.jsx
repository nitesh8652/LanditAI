import { RouterProvider } from "react-router"
import { router } from "./Features/Routes/App.routes.jsx"
import { BrowserRouter, Routes, Route } from "react-router"
import Login from "./Features/Pages/Login.jsx"
import Register from "./Features/Pages/Register.jsx"
import Hero from "./Features/Pages/Hero.jsx"
import ResumeBuilder from "./Features/Pages/ResumeBuilder.jsx"
import { ContextProvider } from "./Features/Context/Context.jsx"
import { verify } from "./Features/Services/auth.api.js"
import Protected from "./Features/Components/Middleware/Protected.jsx"
import Home from "./Features/Interview Report/Pages/Home.jsx"

function App() {


  return (
    <>

{/* <ContextProvider> makes authentication state global. */}
      <ContextProvider>
        {/* used has a primary background color */}
        <div className="min-h-screen bg-[#0A0A0A]">
          {/* hhandles client side navigation */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* added middleware (protected) */}
              <Route path="/ResumeBuilder" element={
                <Protected>
                  <ResumeBuilder />
                  <Home/>
                </Protected>
              } />
            </Routes>
          </BrowserRouter>
        </div>
      </ContextProvider>
    </>
  )
}

export default App
