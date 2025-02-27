import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/ForgotPassword.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setMessage("No registered account found.");
      return;
    }

    const { email: storedEmail } = JSON.parse(storedUser);
    if (email !== storedEmail) {
      setMessage("Email not found.");
      return;
    }

    // ✅ Simulating sending a reset link
    setMessage("Password reset link has been sent to your email.");
    
    // ✅ Redirect user to reset password page after 3 seconds
    setTimeout(() => {
      navigate("/reset-password");
    }, 3000);
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1>Reset Your Password</h1>
        {message && <p className="info-message">{message}</p>}
        
        <form onSubmit={handlePasswordReset} className="form">
          <input
            type="email"
            placeholder="Enter your email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="button">Send Reset Link</button>
        </form>

        <p className="login-extra">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
