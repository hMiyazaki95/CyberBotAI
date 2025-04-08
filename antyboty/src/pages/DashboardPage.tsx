// src/pages/DashboardPage.tsx
import React from "react";
import ModalWrapper from "../components/ModalWrapper";
import DashboardChart from "../components/DashboardChart";
import "../css/ModalWrapper.css";

const DashboardPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Example mock data for charts
  const messagesData = [
    { date: "Apr 1", messages: 12 },
    { date: "Apr 2", messages: 19 },
    { date: "Apr 3", messages: 10 },
    { date: "Apr 4", messages: 21 },
    { date: "Apr 5", messages: 25 },
    { date: "Apr 6", messages: 17 },
    { date: "Apr 7", messages: 23 },
  ];

  const modelUsage = [
    { model: "GPT-4", usage: 18 },
    { model: "GPT-3.5", usage: 26 },
    { model: "Claude 2", usage: 9 },
    { model: "Gemini", usage: 14 },
  ];

  return (
    <ModalWrapper title="Dashboard" onClose={onClose}>
      <div className="dashboard-grid">
        <div className="modal-section">
          <h3>Recent Activity</h3>
          <p>View your recent interactions with the AI.</p>
          <button className="modal-button">View Chat History</button>
        </div>

        <div className="modal-section">
          <h3>Subscription & Billing</h3>
          <p>Manage your subscription plans and payment methods.</p>
          <div className="subscription-info">
            <p><strong>Current Plan:</strong> Premium</p>
            <p><strong>Next Billing Date:</strong> March 5, 2025</p>
          </div>
          <button className="modal-button">Manage Subscription</button>
        </div>

        <div className="modal-section">
          <h3>Analytics</h3>
          <DashboardChart messagesData={messagesData} modelUsage={modelUsage} />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DashboardPage;
