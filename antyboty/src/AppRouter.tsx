// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LandingPage from "./pages/LandingPage";
// import RegisterPage from "./pages/RegisterPage";
// import LoginPage from "./pages/LoginPage";
// import ChatApp from "./App"; // Main App with Popups

// export default function AppRouter() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public Pages */}
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/login" element={<LoginPage />} />
        
//         {/* Main Chat Application (Contains Popups) */}
//         <Route path="/chat" element={<ChatApp />} />
//       </Routes>
//     </Router>
//   );
// }


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; // ✅ New
import ResetPasswordPage from "./pages/ResetPasswordPage"; // ✅ New
import ChatApp from "./App"; 

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/chat" element={<ChatApp />} />
      </Routes>
    </Router>
  );
}
