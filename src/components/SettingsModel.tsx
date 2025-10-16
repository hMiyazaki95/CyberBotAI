import React from "react";
import "../css/ModalWrapper.css";


// Import illustrations
import dashboardIcon from "../assets/icons/dashboard.png";
import accountIcon from "../assets/icons/account.png";
import subscriptionIcon from "../assets/icons/subscription.png";
import notificationsIcon from "../assets/icons/notifications.png";
import aiIcon from "../assets/icons/ai.png";
import deleteIcon from "../assets/icons/delete.png";

type Props = {
  onClose: () => void;
  openModal: (page: string) => void;
};

const SettingsModal: React.FC<Props> = ({ onClose, openModal}) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="modal-section">
          <h2>Settings</h2>

          <div className="card-grid">
            <button className="modal-card" onClick={() => openModal("dashboard")}>
              <h4>Dashboard</h4>
              <img src={dashboardIcon} alt="Dashboard" className="card-icon" />
            </button>

            <button className="modal-card" onClick={() => openModal("account")}>
              <h4>Account</h4>
              <img src={accountIcon} alt="Account" className="card-icon" />
            </button>

            <button className="modal-card" onClick={() => openModal("subscription")}>
              <h4>Subscription</h4>
              <img src={subscriptionIcon} alt="Subscription" className="card-icon" />
            </button>

            <button className="modal-card" onClick={() => openModal("notifications")}>
              <h4>Notifications</h4>
              <img src={notificationsIcon} alt="Notifications" className="card-icon" />
            </button>

            <button className="modal-card" onClick={() => openModal("ai-preferences")}>
              <h4>AI Preferences</h4>
              <img src={aiIcon} alt="AI Preferences" className="card-icon" />
            </button>

            <button className="modal-card delete">
              <h4>Delete Account</h4>
              <img src={deleteIcon} alt="Delete" className="card-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
