import React from "react";
import ModalWrapper from "../components/ModalWrapper";
import "../css/ModalWrapper.css";

const DashboardPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <ModalWrapper title="Dashboard" onClose={onClose}>
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
    </ModalWrapper>
  );
};

export default DashboardPage;
