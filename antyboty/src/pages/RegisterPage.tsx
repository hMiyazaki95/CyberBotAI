import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../css/RegisterPage.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false); // ✅ New state for pop-up
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    return password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setShowErrorPopup(false); // ✅ Hide error popup initially

    console.log("📤 Sending Registration Request...", { username, email, password });

    if (!email.includes("@")) {
      console.error("❌ Invalid email:", email);
      setError("Please enter a valid email.");
      return setShowErrorPopup(true); // ✅ Show pop-up
    }
    if (!validatePassword(password)) {
      console.error("❌ Weak password:", password);
      setError("Password must be at least 8 characters, include a number, and an uppercase letter.");
      return setShowErrorPopup(true);
    }
    if (password !== confirmPassword) {
      console.error("❌ Passwords do not match:", password, confirmPassword);
      setError("Passwords do not match.");
      return setShowErrorPopup(true);
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/register",
        { username, email, password },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      console.log("✅ Registration Response:", response.data);

      if (response.status === 201) {
        setSuccess(true);
        console.log("✅ Redirecting to login in 2 seconds...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err: unknown) {
      console.error("❌ Registration Error:", err);

      if (axios.isAxiosError(err)) {
        console.error("❌ Server Response Error:", err.response?.data || "No response data");
        setError(err.response?.data?.error || "Registration failed.");
      } else {
        setError("An unexpected error occurred.");
      }

      setShowErrorPopup(true); // ✅ Show error pop-up
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1>Create an account</h1>

        {success && <p className="success-message">✅ Account successfully created! Redirecting to login...</p>}

        <form onSubmit={handleRegister} className="form">
          <input type="email" placeholder="Email address" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="text" placeholder="Username" className="input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm Password" className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <button type="submit" className="button">Register</button>
        </form>

        <p className="login-extra">Already have an account? <Link to="/login">Login</Link></p>

        <div className="divider"><span>OR</span></div>

        <div className="social-buttons">
          <button className="social-btn"><img src="/assets/google-logo.svg" alt="Google logo" className="social-logo" />Continue with Google (Coming soon)</button>
          <button className="social-btn"><img src="/assets/microsoft-logo.svg" alt="Microsoft logo" className="social-logo" />Continue with Microsoft (Coming soon)</button>
          <button className="social-btn"><img src="/assets/apple-logo.svg" alt="Apple logo" className="social-logo" />Continue with Apple (Coming soon)</button>
        </div>
      </div>

      {/* ✅ Error Popup Modal */}
      {showErrorPopup && (
        <div className="popup-container">
          <div className="popup">
            <h2>⚠️ Registration Error</h2>
            <p>{error}</p>
            <button className="close-btn" onClick={() => setShowErrorPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
