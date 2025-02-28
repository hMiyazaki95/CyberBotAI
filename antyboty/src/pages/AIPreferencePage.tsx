import React, { useState, useEffect } from "react";
import ModalWrapper from "../components/ModalWrapper";
import "../css/ModalWrapper.css";

const AIPreferencesPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [responseLength, setResponseLength] = useState("Medium");
  const [aiPersonality, setAiPersonality] = useState("Friendly");

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedResponseLength = localStorage.getItem("responseLength");
    const savedAiPersonality = localStorage.getItem("aiPersonality");

    if (savedResponseLength) setResponseLength(savedResponseLength);
    if (savedAiPersonality) setAiPersonality(savedAiPersonality);
  }, []);

  // Function to handle saving preferences
  const savePreferences = () => {
    localStorage.setItem("responseLength", responseLength);
    localStorage.setItem("aiPersonality", aiPersonality);
    alert("Preferences saved successfully!");
  };

  return (
    <ModalWrapper title="AI Preferences" onClose={onClose}>
      <div className="modal-section">
        <h3>Response Customization</h3>
        <p>Customize how the AI interacts with you.</p>

        <div className="preference-item">
          <label htmlFor="response-length">Response Length:</label>
          <select
            id="response-length"
            value={responseLength}
            onChange={(e) => setResponseLength(e.target.value)}
          >
            <option value="Short">Short</option>
            <option value="Medium">Medium</option>
            <option value="Long">Long</option>
          </select>
        </div>

        <div className="preference-item">
          <label htmlFor="ai-personality">AI Personality:</label>
          <select
            id="ai-personality"
            value={aiPersonality}
            onChange={(e) => setAiPersonality(e.target.value)}
          >
            <option value="Friendly">Friendly</option>
            <option value="Professional">Professional</option>
            <option value="Casual">Casual</option>
          </select>
        </div>
      </div>
      <button className="modal-button" onClick={savePreferences}>
        Save Preferences
      </button>
    </ModalWrapper>
  );
};

export default AIPreferencesPage;
