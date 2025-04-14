

//import React from "react";
// import { Link } from "react-router-dom";
// import "../css/LandingPage.css";

// export default function LandingPage() {
//   return (
//     <div className="landing-container">
//       <div className="logo">
//         <img src="/assets/ChatGPT Logo.svg" alt="CyberBot Logo" />
//       </div>
//       <div className="text">
//         <h2>Welcome to CyberBot</h2>
//         <h3>Your cutting-edge cybersecurity assistant.</h3>
//       </div>
//       <div className="button-group">
//         <Link to="/login">
//           <button className="btn">Log In</button>
//         </Link>
//         <Link to="/register">
//           <button className="btn">Sign Up</button>
//         </Link>
//       </div>
//     </div>
//   );
// }
import { Link } from "react-router-dom";  // Importing Link from react-router-dom
import "../css/LandingPage.css";  // Importing styles for the landing page

// Define the LandingPage function
function LandingPage() {
  return (
    <div className="landing-container">
      {/* Main Content with background and animations inside */}
      <div className="landing-content">
        {/* Earth and Animated Background */}
        <div className="earth-container">
          <div className="earth">
            <div className="earth-core"></div>
          </div>
          <div className="thunderbird"></div>
          <div className="shooting-star"></div>
        </div>

        {/* Main Content */}
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
    </div>
  );
}

export default LandingPage;
