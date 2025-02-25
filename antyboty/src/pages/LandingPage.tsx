// import React from "react";
// import { Link } from "react-router-dom";
// import "../Pages.css";

// export default function LandingPage() {
//   return (
//     <div className="page-container">
//       <h1>Welcome to CyberBot</h1>
//       <p>Your cutting-edge cybersecurity assistant.</p>
//       <p>
//         Explore our platform by logging in or creating an account to unlock advanced features.
//       </p>
//       <Link to="/login">
//         <button className="button">Login</button>
//       </Link>
//     </div>
//   );
// }


import React from "react";
import { Link } from "react-router-dom";
import "../css/LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="logo">
        <img src="/assets/ChatGPT Logo.svg" alt="CyberBot Logo" />
      </div>
      <div className="text">
        <h2>Welcome to CyberBot</h2>
        <h3>Your cutting-edge cybersecurity assistant.</h3>
      </div>
      <div className="button-group">
        <Link to="/login">
          <button className="btn">Log In</button>
        </Link>
        <Link to="/register">
          <button className="btn">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}
