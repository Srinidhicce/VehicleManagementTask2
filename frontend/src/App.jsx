import { useState } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  function handleLoginSuccess(receivedToken) {
    localStorage.setItem("token", receivedToken);
    setToken(receivedToken);
    setPage("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken("");
    setPage("login");
  }

  if (token && page !== "login" && page !== "signup") {
    return <Dashboard token={token} onLogout={handleLogout} />;
  }

  if (page === "signup") {
    return <Signup onGoLogin={() => setPage("login")} />;
  }

  return <Login onLoginSuccess={handleLoginSuccess} onGoSignup={() => setPage("signup")} />;
}

export default App;
