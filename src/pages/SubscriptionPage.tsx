import React from "react";
import ModalWrapper from "../components/ModalWrapper";
import "../css/ModalWrapper.css";

const SubscriptionPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <ModalWrapper title="Subscription" onClose={onClose}>
      <div className="modal-section">
        <h3>Manage Your Subscription</h3>
        <p>View and update your subscription plan.</p>
        <div className="subscription-info">
          <p><strong>Current Plan:</strong> Premium</p>
          <p><strong>Next Billing Date:</strong> March 5, 2025</p>
        </div>
        <button className="modal-button">Upgrade Plan</button>
        <button className="modal-button secondary">Cancel Subscription</button>
      </div>
    </ModalWrapper>
  );
};

export default SubscriptionPage;
