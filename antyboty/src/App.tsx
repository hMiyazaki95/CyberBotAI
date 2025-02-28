// import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import "./css/App.css";

// // Import modal components for each page
// import DashboardPage from "./pages/DashboardPage";
// import AccountPage from "./pages/AccountPage";
// import SubscriptionPage from "./pages/SubscriptionPage";
// import NotificationsPage from "./pages/NotificationPage";
// import AIPreferencesPage from "./pages/AIPreferencePage";
// import PrivacyPage from "./pages/PrivacyPage";
// import HelpPage from "./pages/HelpPage";

// type Message = { text: string; sender: "user" | "bot" };
// type ChatSession = { id: number; messages: Message[] };

// function App() {
//   const [value, setValue] = useState<string>("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
//   const [activeChatId, setActiveChatId] = useState<number | null>(null);
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [modalPage, setModalPage] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(e.target.value);
//   };

//   const toggleDropdown = () => {
//     setDropdownVisible((prev) => !prev);
//   };

//   const openModal = (page: string) => {
//     setModalPage(page);
//     setDropdownVisible(false);
//   };

//   const closeModal = () => {
//     setModalPage(null);
//   };

//   const handleSubmit = async () => {
//     if (!value.trim()) return;

//     const userMessage: Message = { text: value, sender: "user" };
//     setMessages((prev) => [...prev, userMessage]);

//     try {
//       const res = await axios.post<{ text: string } | string>(
//         "http://localhost:3005/chatbot",
//         { question: value }
//       );
//       const botText = typeof res.data === "string" ? res.data : res.data.text;

//       setMessages((prev) => [...prev, { text: botText, sender: "bot" }]);
//     } catch (error) {
//       console.error("Error fetching response:", error);
//       setMessages((prev) => [
//         ...prev,
//         { text: "Error: Could not get a response.", sender: "bot" },
//       ]);
//     }

//     setValue("");
//   };

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   useEffect(() => {
//     if (messages.length > 0) {
//       const existingChat = chatHistory.find((chat) => chat.id === activeChatId);
//       if (existingChat) {
//         setChatHistory((prev) =>
//           prev.map((chat) =>
//             chat.id === activeChatId ? { ...chat, messages } : chat
//           )
//         );
//       } else {
//         const newChat: ChatSession = {
//           id: Date.now(),
//           messages,
//         };
//         setChatHistory((prev) => [...prev, newChat]);
//         setActiveChatId(newChat.id);
//       }
//     }
//   }, [messages]);

//   const loadChat = (chatId: number) => {
//     const selectedChat = chatHistory.find((chat) => chat.id === chatId);
//     if (selectedChat) {
//       setMessages(selectedChat.messages);
//       setActiveChatId(chatId);
//     }
//   };

//   return (
//     <div className="chat-container">
//       {/* Sidebar */}
//       <div className="chat-sidebar">
//         <div className="sidebar-title">Chat History</div>
//         <div className="chat-history">
//           {chatHistory.map((chat) => (
//             <div
//               key={chat.id}
//               className={`chat-history-item ${
//                 chat.id === activeChatId ? "active" : ""
//               }`}
//               onClick={() => loadChat(chat.id)}
//             >
//               Chat {chat.id}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="chat-main">
//         <div className="sidebar-title2">
//           <div className="title">CYBERBOT</div>
//           <div className="navbar-right">
//             <div className="navbar-user" onClick={toggleDropdown}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="user-icon"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 width="32px"
//                 height="32px"
//               >
//                 <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
//               </svg>
//               {dropdownVisible && (
//                 <div className="dropdown-menu">
//                   <ul>
//                     <li onClick={() => openModal("dashboard")}>Dashboard</li>
//                     <li onClick={() => openModal("chat-history")}>Chat History</li>
//                     <li onClick={() => openModal("account")}>Account Settings</li>
//                     <li onClick={() => openModal("subscription")}>Subscription</li>
//                     <li onClick={() => openModal("notifications")}>Notifications</li>
//                     <li onClick={() => openModal("ai-preferences")}>AI Preferences</li>
//                     <li onClick={() => openModal("privacy")}>Privacy</li>
//                     <li onClick={() => openModal("help")}>Help</li>
//                     <li>
//                       <Link to="/logout">Log Out</Link>
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Chat Messages */}
//         <div className="chat-messages">
//           {messages.map((msg, index) => (
//             <div key={index} className={`message ${msg.sender}`}>
//               {msg.sender === "bot" ? (
//                 <ReactMarkdown>{msg.text}</ReactMarkdown>
//               ) : (
//                 msg.text
//               )}
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Chat Footer */}
//         <div className="chat-footer-container">
//           {/* Chat Description (Above the Input Box) */}
//           <div className="chat-description">
//             <p>
//               Hi there! I'm your friendly CyberBot—here to guide you through
//               the digital battlefield. Ask me anything about cybersecurity!
//             </p>
//           </div>

//           {/* Input Box */}
//           <div className="chat-footer-box">
//             <div className="chat-input">
//               <input
//                 type="text"
//                 value={value}
//                 onChange={onChange}
//                 placeholder="Enter your question..."
//               />
//               <button onClick={handleSubmit}>Send</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {modalPage && (
//         <div className="modal">
//           <div className="modal-content">
//             <button className="close-button" onClick={closeModal}>×</button>
//             {modalPage === "dashboard" && <DashboardPage onClose={closeModal} />}
//             {modalPage === "account" && <AccountPage onClose={closeModal} />}
//             {modalPage === "subscription" && <SubscriptionPage onClose={closeModal} />}
//             {modalPage === "notifications" && <NotificationsPage onClose={closeModal} />}
//             {modalPage === "ai-preferences" && <AIPreferencesPage onClose={closeModal} />}
//             {modalPage === "privacy" && <PrivacyPage onClose={closeModal} />}
//             {modalPage === "help" && <HelpPage onClose={closeModal} />}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom"; // ✅ Use Navigate for Redirection
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import "./css/App.css";

// // Import modal components for each page
// import DashboardPage from "./pages/DashboardPage";
// import AccountPage from "./pages/AccountPage";
// import SubscriptionPage from "./pages/SubscriptionPage";
// import NotificationsPage from "./pages/NotificationPage";
// import AIPreferencesPage from "./pages/AIPreferencePage";
// import PrivacyPage from "./pages/PrivacyPage";
// import HelpPage from "./pages/HelpPage";

// type Message = { text: string; sender: "user" | "bot" };
// type ChatSession = { id: number; messages: Message[] };

// function App() {
//   const [value, setValue] = useState<string>("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
//   const [activeChatId, setActiveChatId] = useState<number | null>(null);
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [modalPage, setModalPage] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate(); // ✅ Ensuring navigation is available

//   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(e.target.value);
//   };

//   const toggleDropdown = () => {
//     setDropdownVisible((prev) => !prev);
//   };

//   const openModal = (page: string) => {
//     setModalPage(page);
//     setDropdownVisible(false);
//   };

//   const closeModal = () => {
//     setModalPage(null);
//   };

//   const handleSubmit = async () => {
//     if (!value.trim()) return;

//     const userMessage: Message = { text: value, sender: "user" };
//     setMessages((prev) => [...prev, userMessage]);

//     try {
//       const res = await axios.post<{ text: string } | string>(
//         "http://localhost:3005/chatbot",
//         { question: value }
//       );
//       const botText = typeof res.data === "string" ? res.data : res.data.text;

//       setMessages((prev) => [...prev, { text: botText, sender: "bot" }]);
//     } catch (error) {
//       console.error("Error fetching response:", error);
//       setMessages((prev) => [
//         ...prev,
//         { text: "Error: Could not get a response.", sender: "bot" },
//       ]);
//     }

//     setValue("");
//   };

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   useEffect(() => {
//     if (messages.length > 0) {
//       const existingChat = chatHistory.find((chat) => chat.id === activeChatId);
//       if (existingChat) {
//         setChatHistory((prev) =>
//           prev.map((chat) =>
//             chat.id === activeChatId ? { ...chat, messages } : chat
//           )
//         );
//       } else {
//         const newChat: ChatSession = {
//           id: Date.now(),
//           messages,
//         };
//         setChatHistory((prev) => [...prev, newChat]);
//         setActiveChatId(newChat.id);
//       }
//     }
//   }, [messages]);

//   // ✅ Fixed Logout Function
//   const handleLogout = () => {
//     localStorage.removeItem("user"); // ✅ Clears stored user session
//     navigate("/login", { replace: true }); // ✅ Redirects user to login page
//   };

//   return (
//     <div className="chat-container">
//       {/* Sidebar */}
//       <div className="chat-sidebar">
//         <div className="sidebar-title">Chat History</div>
//         <div className="chat-history">
//           {chatHistory.map((chat) => (
//             <div
//               key={chat.id}
//               className={`chat-history-item ${
//                 chat.id === activeChatId ? "active" : ""
//               }`}
//               onClick={() => loadChat(chat.id)}
//             >
//               Chat {chat.id}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="chat-main">
//         <div className="sidebar-title2">
//           <div className="title">CYBERBOT</div>
//           <div className="navbar-right">
//             <div className="navbar-user" onClick={toggleDropdown}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="user-icon"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 width="32px"
//                 height="32px"
//               >
//                 <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
//               </svg>
//               {dropdownVisible && (
//                 <div className="dropdown-menu">
//                   <ul>
//                     <li onClick={() => openModal("dashboard")}>Dashboard</li>
//                     <li onClick={() => openModal("chat-history")}>Chat History</li>
//                     <li onClick={() => openModal("account")}>Account Settings</li>
//                     <li onClick={() => openModal("subscription")}>Subscription</li>
//                     <li onClick={() => openModal("notifications")}>Notifications</li>
//                     <li onClick={() => openModal("ai-preferences")}>AI Preferences</li>
//                     <li onClick={() => openModal("privacy")}>Privacy</li>
//                     <li onClick={() => openModal("help")}>Help</li>
//                     <li onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
//                       Log Out
//                     </li> {/* ✅ Fully Working Logout */}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Chat Messages */}
//         <div className="chat-messages">
//           {messages.map((msg, index) => (
//             <div key={index} className={`message ${msg.sender}`}>
//               {msg.sender === "bot" ? (
//                 <ReactMarkdown>{msg.text}</ReactMarkdown>
//               ) : (
//                 msg.text
//               )}
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Chat Footer */}
//         <div className="chat-footer-container">
//           {/* Chat Description (Above the Input Box) */}
//           <div className="chat-description">
//             <p>
//               Hi there! I'm your friendly CyberBot—here to guide you through
//               the digital battlefield. Ask me anything about cybersecurity!
//             </p>
//           </div>

//           {/* Input Box */}
//           <div className="chat-footer-box">
//             <div className="chat-input">
//               <input
//                 type="text"
//                 value={value}
//                 onChange={onChange}
//                 placeholder="Enter your question..."
//               />
//               <button onClick={handleSubmit}>Send</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import "./css/App.css";

// // Import modal components for each page
// import DashboardPage from "./pages/DashboardPage";
// import AccountPage from "./pages/AccountPage";
// import SubscriptionPage from "./pages/SubscriptionPage";
// import NotificationsPage from "./pages/NotificationPage";
// import AIPreferencesPage from "./pages/AIPreferencePage";
// import PrivacyPage from "./pages/PrivacyPage";
// import HelpPage from "./pages/HelpPage";

// type Message = { text: string; sender: "user" | "bot" };
// type ChatSession = { id: number; messages: Message[] };

// function App() {
//   const [value, setValue] = useState<string>("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
//   const [activeChatId, setActiveChatId] = useState<number | null>(null);
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [modalPage, setModalPage] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState(""); // ✅ Search box state
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate(); // ✅ Navigation hook for logout

//   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(e.target.value);
//   };

//   const toggleDropdown = () => {
//     setDropdownVisible((prev) => !prev);
//   };

//   const openModal = (page: string) => {
//     setModalPage(page);
//     setDropdownVisible(false);
//   };

//   const closeModal = () => {
//     setModalPage(null);
//   };

//   const handleSubmit = async () => {
//     if (!value.trim()) return;

//     const userMessage: Message = { text: value, sender: "user" };
//     setMessages((prev) => [...prev, userMessage]);

//     try {
//       const res = await axios.post<{ text: string } | string>(
//         "http://localhost:3005/chatbot",
//         { question: value }
//       );
//       const botText = typeof res.data === "string" ? res.data : res.data.text;

//       setMessages((prev) => [...prev, { text: botText, sender: "bot" }]);
//     } catch (error) {
//       console.error("Error fetching response:", error);
//       setMessages((prev) => [
//         ...prev,
//         { text: "Error: Could not get a response.", sender: "bot" },
//       ]);
//     }

//     setValue("");
//   };

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   useEffect(() => {
//     if (messages.length > 0) {
//       const existingChat = chatHistory.find((chat) => chat.id === activeChatId);
//       if (existingChat) {
//         setChatHistory((prev) =>
//           prev.map((chat) =>
//             chat.id === activeChatId ? { ...chat, messages } : chat
//           )
//         );
//       } else {
//         const newChat: ChatSession = {
//           id: Date.now(),
//           messages,
//         };
//         setChatHistory((prev) => [...prev, newChat]);
//         setActiveChatId(newChat.id);
//       }
//     }
//   }, [messages]);

//   const loadChat = (chatId: number) => {
//     const selectedChat = chatHistory.find((chat) => chat.id === chatId);
//     if (selectedChat) {
//       setMessages(selectedChat.messages);
//       setActiveChatId(chatId);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <div className="chat-container">
//       {/* Sidebar */}
//       <div className="chat-sidebar">
//       <div className="sidebar-header">
//         <div className="chat-search-container">
//           <input
//             type="text"
//             className="chat-search-input"
//             placeholder="Search chat history..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <kbd className="chat-search-kbd">⌘ K</kbd>
//         </div>
//       </div>

//         <div className="chat-history">
//           {chatHistory
//             .filter((chat) =>
//               chat.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
//             )
//             .map((chat) => (
//               <div
//                 key={chat.id}
//                 className={`chat-history-item ${
//                   chat.id === activeChatId ? "active" : ""
//                 }`}
//                 onClick={() => loadChat(chat.id)}
//               >
//                 Chat {chat.id}
//               </div>
//             ))}
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="chat-main">
//         <div className="sidebar-title2">
//           <div className="title">CYBERBOT</div>
//           <div className="navbar-right">
//             <div className="navbar-user" onClick={toggleDropdown}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="user-icon"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 width="32px"
//                 height="32px"
//               >
//                 <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
//               </svg>
//               {dropdownVisible && (
//                 <div className="dropdown-menu">
//                   <ul>
//                     <li onClick={() => openModal("dashboard")}>Dashboard</li>
//                     <li onClick={() => openModal("chat-history")}>Chat History</li>
//                     <li onClick={() => openModal("account")}>Account Settings</li>
//                     <li onClick={() => openModal("subscription")}>Subscription</li>
//                     <li onClick={() => openModal("notifications")}>Notifications</li>
//                     <li onClick={() => openModal("ai-preferences")}>AI Preferences</li>
//                     <li onClick={() => openModal("privacy")}>Privacy</li>
//                     <li onClick={() => openModal("help")}>Help</li>
//                     <li onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
//                       Log Out
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Chat Messages */}
//         <div className="chat-messages">
//           {messages.map((msg, index) => (
//             <div key={index} className={`message ${msg.sender}`}>
//               {msg.sender === "bot" ? (
//                 <ReactMarkdown>{msg.text}</ReactMarkdown>
//               ) : (
//                 msg.text
//               )}
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Chat Footer */}
//         <div className="chat-footer-container">
//           {/* ✅ Chat Description */}
//           <div className="chat-description">
//             <p>
//               Hi there! I'm your friendly CyberBot—here to guide you through
//               the digital battlefield. Ask me anything about cybersecurity!
//             </p>
//           </div>
//           <div className="chat-footer-box">
//             <div className="chat-input">
//               <input
//                 type="text"
//                 value={value}
//                 onChange={onChange}
//                 placeholder="Enter your question..."
//               />
//               <button onClick={handleSubmit}>Send</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {modalPage && (
//         <div className="modal">
//           <div className="modal-content">
//             <button className="close-button" onClick={closeModal}>×</button>
//             {modalPage === "dashboard" && <DashboardPage onClose={closeModal} />}
//             {modalPage === "account" && <AccountPage onClose={closeModal} />}
//             {modalPage === "subscription" && <SubscriptionPage onClose={closeModal} />}
//             {modalPage === "notifications" && <NotificationsPage onClose={closeModal} />}
//             {modalPage === "ai-preferences" && <AIPreferencesPage onClose={closeModal} />}
//             {modalPage === "privacy" && <PrivacyPage onClose={closeModal} />}
//             {modalPage === "help" && <HelpPage onClose={closeModal} />}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;





import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./css/App.css";
import chatPlusIcon from "./assets/chat-plus.svg"; // Absolute import for Vite

// Import modal components for each page
import DashboardPage from "./pages/DashboardPage";
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
  const navigate = useNavigate(); // ✅ Added navigation
  const [model, setModel] = useState<string>("gpt-4"); // Default model


  const startNewChat = () => {
    const newChat = { id: Date.now(), messages: [] };
    setChatHistory((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
    setMessages([]); // Clear messages for new chat
  };

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

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedModel = e.target.value;
    setModel(selectedModel);
    console.log("Model changed to:", selectedModel); // ✅ Debugging log
  };

  const getPersonalityPrompt = (personality: string) => {
    switch (personality) {
      case "Professional":
        return `You are CyberBot, a highly professional cybersecurity assistant. Your responses should be formal, precise, and direct, avoiding unnecessary casual language. Use proper cybersecurity terminology and structured explanations while maintaining a helpful, authoritative tone.`;
      case "Friendly":
        return `You are CyberBot, a friendly and engaging cybersecurity assistant. Your responses should be warm, approachable, and encouraging, using simple language where possible. Speak as if you are explaining to a beginner, keeping the conversation supportive and easy to follow.`;
      case "Casual":
        return `You are CyberBot, a relaxed and easygoing cybersecurity assistant. Your responses should be conversational, informal, and engaging, using simple analogies and making technical topics easy to understand. Feel free to use humor when appropriate.`;
      default:
        return `You are CyberBot, a neutral cybersecurity assistant. Provide helpful responses with a balanced tone.`;
    }
  };
  
  const handleSubmit = async () => {
    if (!value.trim()) return;
  
    const userMessage: Message = { text: value, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
  
    const aiPersonality = localStorage.getItem("aiPersonality") || "Friendly"; 
    const responseLength = localStorage.getItem("responseLength") || "Medium";
  
    const personalityPrompt = getPersonalityPrompt(aiPersonality);
    
    const prompt = `${personalityPrompt}\n\nUser: ${value}\nAI:`;
  
    // Define max token count based on response length preference
    const maxTokens = responseLength === "Short" ? 50 : responseLength === "Long" ? 200 : 100;
  
    try {
      const res = await axios.post<{ text: string } | string>(
        "http://localhost:3005/chatbot",
        {
          question: prompt,
          model,
          max_tokens: maxTokens, // 🔥 Now using responseLength
        }
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
    setActiveChatId((prev) => (prev === chatId ? prev : chatId)); // Ensures state updates
    const selectedChat = chatHistory.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("user"); // ✅ Clear stored session
    navigate("/login"); // ✅ Redirect user to Login page
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
      <div className="sidebar-header">
        <input
          type="text"
          placeholder="Search Your Chat History..."
          className="search-input"
        />
        <button className="new-chat-btn" onClick={startNewChat}>
          <img src={chatPlusIcon} alt="New Chat" />
        </button>

      </div>


        <div className="chat-history">
          {chatHistory.map((chat) => (
            <div
            key={chat.id}
            className={`chat-history-item ${chat.id === activeChatId ? "active" : ""}`}
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
          {/* LLM Model Dropdown */}
          <div className="llm-dropdown-container">
            <label htmlFor="llm-model" className="llm-label">
              Select AI Model:
            </label>
            <select
              id="llm-model"
              className="llm-dropdown"
              value={model}
              onChange={handleModelChange} // ✅ Updates the model state
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5-Turbo</option>
              <option value="claude-2">Claude 2</option>
              <option value="gemini">Gemini</option>
            </select>
          </div>

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
                    <li onClick={() => openModal("account")}>Account Settings</li>
                    <li onClick={() => openModal("subscription")}>Subscription</li>
                    <li onClick={() => openModal("notifications")}>Notifications</li>
                    <li onClick={() => openModal("ai-preferences")}>AI Preferences</li>
                    <li onClick={() => openModal("privacy")}>Privacy</li>
                    <li onClick={() => openModal("help")}>Help</li>
                    <li onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
                      Log Out
                    </li> {/* ✅ Logout button works properly */}
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
          <div className="chat-description">
            <p>
              Hi there! I'm your friendly CyberBot—here to guide you through
              the digital battlefield. Ask me anything about cybersecurity!
            </p>
          </div>

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
            {modalPage === "dashboard" && <DashboardPage onClose={closeModal} />}
            {modalPage === "account" && <AccountPage onClose={closeModal} />}
            {modalPage === "subscription" && <SubscriptionPage onClose={closeModal} />}
            {modalPage === "notifications" && <NotificationsPage onClose={closeModal} />}
            {modalPage === "ai-preferences" && <AIPreferencesPage onClose={closeModal} />}
            {modalPage === "privacy" && <PrivacyPage onClose={closeModal} />}
            {modalPage === "help" && <HelpPage onClose={closeModal} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;