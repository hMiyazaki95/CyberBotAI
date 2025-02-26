import React from "react";

interface LLMSelectorProps {
  selectedLLM: string;
  setSelectedLLM: (model: string) => void;
}

const LLMSelector: React.FC<LLMSelectorProps> = ({
  selectedLLM,
  setSelectedLLM,
}) => {
  const llmOptions = ["gpt-3.5-turbo", "gpt-4", "custom-llm"];

  return (
    <div className="llm-selector">
      <label htmlFor="llm-dropdown">Select LLM:</label>
      <select
        id="llm-dropdown"
        value={selectedLLM}
        onChange={(e) => setSelectedLLM(e.target.value)}
      >
        {llmOptions.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LLMSelector;
