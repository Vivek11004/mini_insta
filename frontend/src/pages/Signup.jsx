import { useState } from "react";
import { apiFetch } from "../api/client";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setError(null);

    const res = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (res?.detail) {
      setError(res.detail);
      return;
    }

    // redirect to login after signup
    navigate("/login");
  }

  return (
    <form onSubmit={handleSignup}>
      <h2>Signup</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
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

      <button>Signup</button>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}
