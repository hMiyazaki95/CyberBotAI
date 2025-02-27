import React from "react";
import ModalWrapper from "../components/ModalWrapper";
import "../css/ModalWrapper.css";

const HelpPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <ModalWrapper title="Help & Support" onClose={onClose}>
      <div className="modal-section">
        <h3>Frequently Asked Questions</h3>
        <p>Find answers to common questions.</p>
        <button className="modal-button">View FAQs</button>
      </div>

      <div className="modal-section">
        <h3>Contact Support</h3>
        <p>Need further assistance? Reach out to our support team.</p>
        <button className="modal-button">Send a Message</button>
      </div>
    </ModalWrapper>
  );
};

export default HelpPage;
