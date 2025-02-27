import React from "react";
import ModalWrapper from "../components/ModalWrapper";
import "../css/ModalWrapper.css";

const AIPreferencesPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <ModalWrapper title="AI Preferences" onClose={onClose}>
      <div className="modal-section">
        <h3>Response Customization</h3>
        <p>Customize how the AI interacts with you.</p>

        <div className="preference-item">
          <label htmlFor="response-length">Response Length:</label>
          <select id="response-length">
            <option>Short</option>
            <option>Medium</option>
            <option>Long</option>
          </select>
        </div>

        <div className="preference-item">
          <label htmlFor="ai-personality">AI Personality:</label>
          <select id="ai-personality">
            <option>Friendly</option>
            <option>Professional</option>
            <option>Casual</option>
          </select>
        </div>
      </div>
      <button className="modal-button">Save Preferences</button>
    </ModalWrapper>
  );
};

export default AIPreferencesPage;
