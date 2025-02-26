import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ChatHistoryPage from "./pages/ChatHistoryPage";
import AccountPage from "./pages/AccountPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import NotificationsPage from "./pages/NotificationPage";
import AIPreferencesPage from "./pages/AIPreferencePage";
import PrivacyPage from "./pages/PrivacyPage";
import HelpPage from "./pages/HelpPage";
import ChatApp from "./App";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public Pages (No Layout) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Main App Pages */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/chat-history" element={<ChatHistoryPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/ai-preferences" element={<AIPreferencesPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/chat" element={<ChatApp />} />
      </Routes>
    </Router>
  );
}
