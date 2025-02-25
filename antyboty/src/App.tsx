import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./css/App.css";

type Message = { text: string; sender: "user" | "bot" };
type ChatSession = { id: number; messages: Message[] };

function App() {
  const [value, setValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (!value.trim()) return; // Prevent sending empty messages

    const userMessage: Message = { text: value, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const res = await axios.post<{ text: string } | string>(
        "http://localhost:3005/chatbot",
        { question: value }
      );
      const botText = typeof res.data === "string" ? res.data : res.data.text;

      const botMessage: Message = { text: botText, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error: Could not get a response.", sender: "bot" },
      ]);
    }

    setValue(""); // Clear input after sending
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Save chat session when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const existingChat = chatHistory.find((chat) => chat.id === activeChatId);
      if (existingChat) {
        // Update existing chat
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages } : chat
          )
        );
      } else {
        // Create new chat session
        const newChat: ChatSession = {
          id: Date.now(),
          messages,
        };
        setChatHistory((prev) => [...prev, newChat]);
        setActiveChatId(newChat.id);
      }
    }
  }, [messages]);

  // Load selected chat from history
  const loadChat = (chatId: number) => {
    const selectedChat = chatHistory.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setActiveChatId(chatId);
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-title">Chat History</div>
        <div className="chat-history">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`chat-history-item ${
                chat.id === activeChatId ? "active" : ""
              }`}
              onClick={() => loadChat(chat.id)}
            >
              Chat {chat.id}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.sender === "bot" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
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
