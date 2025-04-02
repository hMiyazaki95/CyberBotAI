// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChatApp from "./App";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Import the ProtectedRoute component

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* 🔥 Protect the Chat Route */}
        <Route path="/chat" element={<ProtectedRoute element={<ChatApp />} />} />
        <Route path="/chat/:chatId" element={<ProtectedRoute element={<ChatApp />} />} />
      </Routes>
    </Router>
  );
}
