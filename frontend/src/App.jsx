import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./routes/Signup";
import Signin from "./routes/Signin";
import Send from "./routes/Send";
import Dashboard from "./routes/Dashboard";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<Send />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App