import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    console.log("LOGIN RESPONSE:", data);

    if (!data?.access_token) {
      setError("Invalid email or password");
      return;
    }

    // ✅ Save auth data
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user_id", data.user_id); // 🔥 REQUIRED

    // ✅ Redirect to feed
    navigate("/", { replace: true });
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>

      <p>
        New user? <Link to="/signup">Signup</Link>
      </p>
    </form>
  );
}
