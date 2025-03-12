import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // ✅ Popup state
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // ✅ Store token
        setShowSuccessPopup(true); // ✅ Show popup
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate("/chat"); // ✅ Redirect to chat
        }, 2000);
      } else {
        setError(data.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1 className="text-center">Sign In</h1>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin} className="form">
          <input
            type="email"
            placeholder="Email address"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="button">Continue</button>
        </form>

        <p className="login-extra">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-buttons">
          <button className="social-btn">
            <img src="/assets/google-logo.svg" alt="Google logo" className="social-logo" />
            Continue with Google (Coming soon)
          </button>
          <button className="social-btn">
            <img src="/assets/microsoft-logo.svg" alt="Microsoft logo" className="social-logo" />
            Continue with Microsoft (Coming soon)
          </button>
          <button className="social-btn">
            <img src="/assets/apple-logo.svg" alt="Apple logo" className="social-logo" />
            Continue with Apple (Coming soon)
          </button>
        </div>

        <p className="login-extra">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>

      {/* ✅ Professional Login Success Popup */}
      {showSuccessPopup && (
        <div className="popup-container">
          <div className="popup">
            <h2>🎉 Login Successful!</h2>
            <p>Redirecting to chat...</p>
          </div>
        </div>
      )}
    </div>
  );
}
