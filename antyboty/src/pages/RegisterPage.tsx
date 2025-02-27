// import React, { useState } from "react";
// import "../css/RegisterPage.css";

// export default function RegisterPage() {
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (email) {
//       setStep(2);
//     }
//   };

//   const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }
//     // API call to register user
//     console.log("Registering user:", { username, email });
//   };

//   return (
//     <div className="page-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
//       <div className="form-container">
//         <h1>Create an account</h1>
//         {step === 1 && (
//           <form onSubmit={handleEmailSubmit} className="form">
//             <input
//               type="email"
//               placeholder="Email address"
//               className="input"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <button type="submit" className="button">
//               Continue
//             </button>
//           </form>
//         )}

//         {step === 2 && (
//           <form onSubmit={handleRegister} className="form">
//             <input
//               type="text"
//               placeholder="Username"
//               className="input"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               className="input"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <input
//               type="password"
//               placeholder="Confirm Password"
//               className="input"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//             <button type="submit" className="button">
//               Register
//             </button>
//           </form>
//         )}

//         <p className="login-extra">
//           Already have an account? <a href="/login">Login</a>
//         </p>

//         <div className="divider">
//           <span>OR</span>
//         </div>

//         <div className="social-buttons">
//           <button className="social-btn">
//             <img
//               src="/assets/google-logo.svg"
//               alt="Google logo"
//               className="social-logo"
//             />
//             Continue with Google
//           </button>
//           <button className="social-btn">
//             <img
//               src="/assets/microsoft-logo.svg"
//               alt="Microsoft logo"
//               className="social-logo"
//             />
//             Continue with Microsoft Account
//           </button>
//           <button className="social-btn">
//             <img
//               src="/assets/apple-logo.svg"
//               alt="Apple logo"
//               className="social-logo"
//             />
//             Continue with Apple
//           </button>
//         </div>

//         <footer className="footer">
//           <a href="/terms">Terms of Use</a> | <a href="/privacy">Privacy Policy</a>
//         </footer>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/RegisterPage.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    return password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password);
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // ✅ Get existing users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const emailExists = storedUsers.some((user: { email: string }) => user.email === email);

    if (emailExists) {
      setError("Email is already registered. Try logging in.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters, include a number and an uppercase letter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // ✅ Store the new user in localStorage (Array of Users)
    const newUser = { username, email, password };
    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    console.log("User registered:", newUser);

    // ✅ Show success message
    setSuccess(true);

    // ✅ Redirect to login page after 2 seconds
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1>Create an account</h1>

        {/* ✅ Show error message */}
        {error && <p className="error-message">{error}</p>}

        {/* ✅ Show success message */}
        {success && <p className="success-message">Account successfully created! Redirecting to login...</p>}

        <form onSubmit={handleRegister} className="form">
          <input
            type="email"
            placeholder="Email address"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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
          <button type="submit" className="button">Register</button>
        </form>

        <p className="login-extra">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <div className="divider">
          <span>OR</span>
        </div>

        {/* ✅ Social Login Buttons */}
        <div className="social-buttons">
          <button className="social-btn">
            <img src="/assets/google-logo.svg" alt="Google logo" className="social-logo" />
            Continue with Google
          </button>
          <button className="social-btn">
            <img src="/assets/microsoft-logo.svg" alt="Microsoft logo" className="social-logo" />
            Continue with Microsoft
          </button>
          <button className="social-btn">
            <img src="/assets/apple-logo.svg" alt="Apple logo" className="social-logo" />
            Continue with Apple
          </button>
        </div>
      </div>
    </div>
  );
}
