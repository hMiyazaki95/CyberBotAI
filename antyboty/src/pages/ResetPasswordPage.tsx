import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/ResetPassword.css";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[A-Z]/.test(newPassword)) {
      setError("Password must be at least 8 characters, include a number and an uppercase letter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // ✅ Save new password in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      userData.password = newPassword;
      localStorage.setItem("user", JSON.stringify(userData));
      setSuccess(true);

      // ✅ Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1>Set a New Password</h1>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Password successfully reset! Redirecting to login...</p>}

        <form onSubmit={handleResetPassword} className="form">
          <input
            type="password"
            placeholder="New Password"
            className="input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
          <button type="submit" className="button">Reset Password</button>
        </form>

        <p className="login-extra">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
