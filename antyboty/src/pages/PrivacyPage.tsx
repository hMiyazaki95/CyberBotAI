import React from "react";
import ModalWrapper from "../components/ModalWrapper";
import "../css/ModalWrapper.css";

const PrivacyPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <ModalWrapper title="Privacy Settings" onClose={onClose}>
      <div className="modal-section">
        <h3>Data Control</h3>
        <p>Manage your data privacy settings.</p>
        <button className="modal-button">Delete Account</button>
        <button className="modal-button secondary">Download Data</button>
      </div>
    </ModalWrapper>
  );
};

export default PrivacyPage;
