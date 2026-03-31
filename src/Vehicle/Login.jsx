import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const ok = login(form.email, form.password);
    if (ok) {
      navigate("/dashboard", { replace: true });
    } else {
      setError("Invalid credentials. Please check your email and password.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign In</h2>
        <p className="auth-subtitle">Vehicle Management Platform</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value.trim() })}
              placeholder="test@gmail.com"
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value.trim() })}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className="error-box">{error}</div>}
          <button type="submit" className="btn-primary full-width">Sign In</button>
        </form>
      </div>
    </div>
  );
}
