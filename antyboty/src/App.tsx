import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./css/App.css";

// Import modal components for each page
import DashboardPage from "./pages/DashboardPage";
import ChatHistoryPage from "./pages/ChatHistoryPage";
import AccountPage from "./pages/AccountPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import NotificationsPage from "./pages/NotificationPage";
import AIPreferencesPage from "./pages/AIPreferencePage";
import PrivacyPage from "./pages/PrivacyPage";
import HelpPage from "./pages/HelpPage";

type Message = { text: string; sender: "user" | "bot" };
type ChatSession = { id: number; messages: Message[] };

function App() {
  const [value, setValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [modalPage, setModalPage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const openModal = (page: string) => {
    setModalPage(page);
    setDropdownVisible(false);
  };

  const closeModal = () => {
    setModalPage(null);
  };

  const handleSubmit = async () => {
    if (!value.trim()) return;

    const userMessage: Message = { text: value, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post<{ text: string } | string>(
        "http://localhost:3005/chatbot",
        { question: value }
      );
      const botText = typeof res.data === "string" ? res.data : res.data.text;

      setMessages((prev) => [...prev, { text: botText, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error: Could not get a response.", sender: "bot" },
      ]);
    }

    setValue("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      const existingChat = chatHistory.find((chat) => chat.id === activeChatId);
      if (existingChat) {
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages } : chat
          )
        );
      } else {
        const newChat: ChatSession = {
          id: Date.now(),
          messages,
        };
        setChatHistory((prev) => [...prev, newChat]);
        setActiveChatId(newChat.id);
      }
    }
  }, [messages]);

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
        <div className="sidebar-title2">
          <div className="title">CYBERBOT</div>
          <div className="navbar-right">
            <div className="navbar-user" onClick={toggleDropdown}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="user-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="32px"
                height="32px"
              >
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
              </svg>
              {dropdownVisible && (
                <div className="dropdown-menu">
                  <ul>
                    <li onClick={() => openModal("dashboard")}>Dashboard</li>
                    <li onClick={() => openModal("chat-history")}>Chat History</li>
                    <li onClick={() => openModal("account")}>Account Settings</li>
                    <li onClick={() => openModal("subscription")}>Subscription</li>
                    <li onClick={() => openModal("notifications")}>Notifications</li>
                    <li onClick={() => openModal("ai-preferences")}>AI Preferences</li>
                    <li onClick={() => openModal("privacy")}>Privacy</li>
                    <li onClick={() => openModal("help")}>Help</li>
                    <li>
                      <Link to="/logout">Log Out</Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
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

        {/* Chat Footer */}
        <div className="chat-footer-container">
          {/* Chat Description (Above the Input Box) */}
          <div className="chat-description">
            <p>
              Hi there! I'm your friendly CyberBot—here to guide you through
              the digital battlefield. Ask me anything about cybersecurity!
            </p>
          </div>

          {/* Input Box */}
          <div className="chat-footer-box">
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

      {/* Modals */}
      {modalPage && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>×</button>
            {modalPage === "dashboard" && <DashboardPage />}
            {modalPage === "chat-history" && <ChatHistoryPage />}
            {modalPage === "account" && <AccountPage />}
            {modalPage === "subscription" && <SubscriptionPage />}
            {modalPage === "notifications" && <NotificationsPage />}
            {modalPage === "ai-preferences" && <AIPreferencesPage />}
            {modalPage === "privacy" && <PrivacyPage />}
            {modalPage === "help" && <HelpPage />}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
