

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
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/LandingPage.css";

function LandingPage() {
  const [speechBubbleText, setSpeechBubbleText] = useState("");
  const messages = [
    "Welcome to the world of Cybersecurity!",
    "Ready to protect your digital assets?",
    "Let me guide you through cyber defense!",
    "Interested in learning about threats?"
  ];

  useEffect(() => {
    let messageIndex = 0;
    const interval = setInterval(() => {
      setSpeechBubbleText(messages[messageIndex]);
      messageIndex = (messageIndex + 1) % messages.length;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-container">
      {/* Animated Background */}
      <div className="cyber-grid"></div>
      <div className="matrix-rain"></div>

      {/* Main Content */}
      <div className="landing-content">
        {/* Robot Avatar with Speech Bubble */}
        <div className="robot-section">
          <div className="speech-bubble">
            <p>{speechBubbleText}</p>
            <div className="speech-arrow"></div>
          </div>
          <div className="robot-avatar">
            <div className="robot-head">
              <div className="robot-antenna"></div>
              <div className="robot-eyes">
                <div className="eye left-eye"></div>
                <div className="eye right-eye"></div>
              </div>
              <div className="robot-mouth"></div>
            </div>
            <div className="robot-body">
              <div className="body-light"></div>
              <div className="body-light"></div>
              <div className="body-light"></div>
            </div>
          </div>
        </div>

        {/* Logo and Text */}
        <div className="logo">
          <img src="/assets/ChatGPT Logo.svg" alt="CyberBot Logo" />
        </div>
        <div className="text">
          <h2>Welcome to CyberBot</h2>
          <h3>Your AI-Powered Cybersecurity Guardian</h3>
          <p className="subtitle">Defend. Detect. Respond. 24/7 Protection.</p>
        </div>

        {/* Feature Icons */}
        <div className="features-row">
          <div className="feature-icon">
            <div className="icon-circle">🛡️</div>
            <span>Threat Detection</span>
          </div>
          <div className="feature-icon">
            <div className="icon-circle">🔒</div>
            <span>Data Protection</span>
          </div>
          <div className="feature-icon">
            <div className="icon-circle">⚡</div>
            <span>Real-time Analysis</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="button-group">
          <Link to="/login">
            <button className="btn btn-primary">Log In</button>
          </Link>
          <Link to="/register">
            <button className="btn btn-secondary">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
