import React from "react";
import ModalWrapper from "../components/ModalWrapper";
import "../css/ModalWrapper.css";

const AccountPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <ModalWrapper title="Account Settings" onClose={onClose}>
      <div className="modal-section">
        <h3>Profile Information</h3>
        <p>Manage your account details and preferences.</p>
        <div className="input-group">
          <label>Name</label>
          <input type="text" placeholder="Enter your name" />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <button className="modal-button">Save Changes</button>
      </div>
      
      <div className="modal-section">
        <h3>Security</h3>
        <p>Update your password and security settings.</p>
        <button className="modal-button">Change Password</button>
        <button className="modal-button secondary">Enable Two-Factor Authentication</button>
      </div>
    </ModalWrapper>
  );
};

export default AccountPage;
