import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [value, setValue] = useState<string>("");
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (!value.trim()) return; // Prevent sending empty messages

    // Store user's message
    const userMessage = { text: value, sender: "user" as const };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send request to backend
      const res = await axios.post<{ text: string } | string>(
        "http://localhost:3005/chatbot",
        { question: value }
      );
      const botText =
        typeof res.data === "string" ? res.data : res.data.text;

      // Store bot's response
      const botMessage = { text: botText, sender: "bot" as const };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error: Could not get a response.", sender: "bot" as const },
      ]);
    }

    setValue(""); // Clear input after sending
  };

  return (
    <div className="chat-container">
      {/* Sidebar (if you have one) */}
      <div className="chat-sidebar">
        {/* Sidebar content remains unchanged */}
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="chat-header">Cybersecurity AI Bot</div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Footer Container at the bottom */}
        <div className="chat-footer-container">
          <div className="chat-footer-box">
            <div className="chat-description">
              <p>
                Hi there! I'm your friendly CyberBot—here to guide you through
                the digital battlefield. Ask me anything about cybersecurity!
              </p>
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Enter your question..."
              />
              <button onClick={handleSubmit}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;