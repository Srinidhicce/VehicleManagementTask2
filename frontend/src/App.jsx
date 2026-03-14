import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AddDriver from "./pages/AddDriver";
import DriverList from "./pages/DriverList";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/home" element={<Home />} />

        <Route path="/add-driver" element={<AddDriver />} />

        <Route path="/drivers" element={<DriverList />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;