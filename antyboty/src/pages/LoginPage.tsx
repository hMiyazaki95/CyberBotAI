// import React, { useState, ChangeEvent, FormEvent, JSX } from "react";
// import { Link } from "react-router-dom";
// import "../css/LoginPage.css";

// export default function LoginPage(): JSX.Element {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");

//   const handleLogin = (e: FormEvent<HTMLFormElement>): void => {
//     e.preventDefault();
//     console.log("Logging in:", email);
//   };

//   return (
//     <div className="page-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
//       <div className="form-container">
//         <h1 className="text-center">Sign In</h1>
//         <form className="form" onSubmit={handleLogin}>
//           <input
//             type="email"
//             placeholder="Email address"
//             className="input"
//             value={email}
//             onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="input"
//             value={password}
//             onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//             required
//           />
//           <button type="submit" className="button">Continue</button>
//         </form>

//         <p className="login-extra">
//           <Link className="link" to="/forgot-password">Forgot password?</Link>
//         </p>

//         <div className="divider">
//           <span>OR</span>
//         </div>

//         <div className="social-buttons">
//           <button className="social-btn">
//             <img src="/assets/google-logo.svg" alt="Google logo" className="social-logo" />
//             Continue with Google
//           </button>
//           <button className="social-btn">
//             <img src="/assets/microsoft-logo.svg" alt="Microsoft logo" className="social-logo" />
//             Continue with Microsoft Account
//           </button>
//           <button className="social-btn">
//             <img src="/assets/apple-logo.svg" alt="Apple logo" className="social-logo" />
//             Continue with Apple
//           </button>
//         </div>

//         <p className="login-extra">
//           Don't have an account? <Link className="link" to="/register">Sign up</Link>
//         </p>

//         <footer className="footer">
//           <a href="/terms">Terms of Use</a> | <a href="/privacy">Privacy Policy</a>
//         </footer>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // ✅ Get all users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const user = storedUsers.find((user: { email: string, password: string }) => 
      user.email === email && user.password === password
    );

    if (user) {
      console.log("Login successful!");
      navigate("/chat");
    } else {
      setError("Incorrect email or password.");
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

        {/* ✅ Social Login Buttons Restored */}
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

        <p className="login-extra">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
