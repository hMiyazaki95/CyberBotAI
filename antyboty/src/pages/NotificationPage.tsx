import React from "react";
import ModalWrapper from "../components/ModalWrapper";
import "../css/ModalWrapper.css";

const NotificationsPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <ModalWrapper title="Notifications" onClose={onClose}>
      <div className="modal-section">
        <h3>Notification Preferences</h3>
        <p>Customize how you receive notifications.</p>

        <div className="preference-item">
          <label htmlFor="email-notifications">Email Notifications:</label>
          <select id="email-notifications" title="Email Notification Settings">
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
        </div>

        <div className="preference-item">
          <label htmlFor="push-notifications">Push Notifications:</label>
          <select id="push-notifications" title="Push Notification Settings">
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
        </div>

        <button className="modal-button">Save Preferences</button>
      </div>
    </ModalWrapper>
  );
};

export default NotificationsPage;
