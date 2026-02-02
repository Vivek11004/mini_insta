import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";

export default function App() {
  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("token")
  );

  // keep auth state in sync
  useEffect(() => {
    const handler = () => {
      setIsAuth(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={isAuth ? <Feed /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
