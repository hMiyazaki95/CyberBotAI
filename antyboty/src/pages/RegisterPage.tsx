import React, { useState } from "react";
import "../css/RegisterPage.css";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setStep(2);
    }
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // API call to register user
    console.log("Registering user:", { username, email });
  };

  return (
    <div className="page-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div className="form-container">
        <h1>Create an account</h1>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="form">
            <input
              type="email"
              placeholder="Email address"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="button">
              Continue
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleRegister} className="form">
            <input
              type="text"
              placeholder="Username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <input
              type="password"
              placeholder="Confirm Password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="button">
              Register
            </button>
          </form>
        )}

        <p className="login-extra">
          Already have an account? <a href="/login">Login</a>
        </p>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-buttons">
          <button className="social-btn">
            <img
              src="/assets/google-logo.svg"
              alt="Google logo"
              className="social-logo"
            />
            Continue with Google
          </button>
          <button className="social-btn">
            <img
              src="/assets/microsoft-logo.svg"
              alt="Microsoft logo"
              className="social-logo"
            />
            Continue with Microsoft Account
          </button>
          <button className="social-btn">
            <img
              src="/assets/apple-logo.svg"
              alt="Apple logo"
              className="social-logo"
            />
            Continue with Apple
          </button>
        </div>

        <footer className="footer">
          <a href="/terms">Terms of Use</a> | <a href="/privacy">Privacy Policy</a>
        </footer>
      </div>
    </div>
  );
}
