import React, { useState, useEffect } from "react";
import ModalWrapper from "../components/ModalWrapper";
import "../css/ModalWrapper.css";

const AIPreferencesPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [responseLength, setResponseLength] = useState("Medium");
  const [aiPersonality, setAiPersonality] = useState("Friendly");
  const [aiModel, setAiModel] = useState("ollama");

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedResponseLength = localStorage.getItem("responseLength");
    const savedAiPersonality = localStorage.getItem("aiPersonality");
    const savedAiModel = localStorage.getItem("aiModel");

    if (savedResponseLength) setResponseLength(savedResponseLength);
    if (savedAiPersonality) setAiPersonality(savedAiPersonality);
    if (savedAiModel) setAiModel(savedAiModel);
  }, []);

  // Function to handle saving preferences
  const savePreferences = () => {
    localStorage.setItem("responseLength", responseLength);
    localStorage.setItem("aiPersonality", aiPersonality);
    localStorage.setItem("aiModel", aiModel);
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

        <div className="preference-item">
          <label htmlFor="ai-model">AI Model:</label>
          <select
            id="ai-model"
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
          >
            <option value="ollama">🦙 Ollama (Free, Local)</option>
            <option value="gpt-4">OpenAI GPT-4 (Requires API Key)</option>
            <option value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</option>
          </select>
          <p style={{fontSize: "12px", color: "#666", marginTop: "8px"}}>
            {aiModel === "ollama" && "✅ Free local AI - No API key needed!"}
            {aiModel.startsWith("gpt") && "⚠️ Requires OpenAI API key with credits"}
          </p>
        </div>
      </div>
      <button className="modal-button" onClick={savePreferences}>
        Save Preferences
      </button>
    </ModalWrapper>
  );
};

export default AIPreferencesPage;
