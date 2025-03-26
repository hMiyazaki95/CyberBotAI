import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./css/App.css";
// import chatPlusIcon from "../public/assets/chat-plus.svg"; // Absolute import for Vite

// Import modal components for each page
import DashboardPage from "./pages/DashboardPage";
import AccountPage from "./pages/AccountPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import NotificationsPage from "./pages/NotificationPage";
import AIPreferencesPage from "./pages/AIPreferencePage";
import PrivacyPage from "./pages/PrivacyPage";
import HelpPage from "./pages/HelpPage";

type Message = { 
  text: string; 
  sender: "user" | "bot"; 
  timestamp?: Date | string; // Optional timestamp
};

// type ChatSession = {
//   id: string;
//   chat_name?: string;
//   messages: Message[];
// };

type ChatData = {
  id: number | string;  // ✅ Add `id` to match `ChatSession`
  chat_id: number | string;
  chat_name?: string;
  messages: Message[];
};

export type ChatSession = {
  id: number | string;
  chat_name?: string;
  messages: Message[];
};




function App() {
  const [value, setValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  //const userId = localStorage.getItem("userId"); // ✅ Get userId from storage
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  // const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [activeChatId, setActiveChatId] = useState<number | string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [modalPage, setModalPage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // ✅ Added navigation
  const [model, setModel] = useState<string>("gpt-4"); // Default model

  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  //const userId = localStorage.getItem("userId");
  const storedUserId = localStorage.getItem("userId") || ""; // guaranteed to be a string
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
  
      // Close if clicking outside .chat-menu or .menu-button
      if (!target.closest(".chat-menu") && !target.closest(".menu-button")) {
        setMenuOpen(null);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  // useEffect(() => {
  //   const storedUserId = localStorage.getItem("userId");
  //   if (!storedUserId) {
  //       console.warn("⚠️ No stored userId found.");
  //       return;
  //   }

  //   console.log(`🔍 Fetching chat history for userId: ${storedUserId}`);

  //   axios
  //       .get(`http://localhost:5001/api/chat-history/${storedUserId}`)
  //       .then((res) => {
  //           console.log("✅ Full Chat History Response:", res.data);

  //           if (!res.data.success) {
  //               console.error("❌ API Error: Success flag is false.");
  //               return;
  //           }

  //           if (!Array.isArray(res.data.data)) {
  //               console.error("❌ API Error: Expected an array but got:", res.data.data);
  //               return;
  //           }

  //           // ✅ Ensure chat_id is valid and unique
  //           // const chatSessions: ChatSession[] = res.data.data.map((chat: ChatData, index: number) => {
  //           //     const chatId = Number(chat.chat_id);
  //           //     return {
  //           //         id: !isNaN(chatId) ? chatId : `chat-${index + 1}`, // ✅ Assign a fallback string ID
  //           //         chat_name: chat.chat_name || `Chat ${index + 1}`,
  //           //         messages: Array.isArray(chat.messages) ? chat.messages : [],
  //           //     };
  //           // });

  //           const chatSessions: ChatSession[] = res.data.data.map((chat: ChatData, index: number) => ({
  //             id: chat.chat_id, // ✅ Always use the real DB id!
  //             chat_name: chat.chat_name || `Chat ${index + 1}`,
  //             messages: Array.isArray(chat.messages) ? chat.messages : [],
  //           }));
            
  //           setChatHistory(chatSessions);
            
            

  //           console.log("✅ Processed Chat Sessions:", chatSessions);
  //           setChatHistory(chatSessions);

  //           if (chatSessions.length > 0) {
  //               const lastChat = chatSessions[chatSessions.length - 1];
  //               setActiveChatId(lastChat.id);
  //               setMessages(lastChat.messages);
  //           } else {
  //               console.warn("⚠️ No chat history found.");
  //           }
  //       })
  //       .catch((error) => console.error("❌ Error loading chat history:", error));
  // }, []);

  const startNewChat = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID missing.");
      return;
    }
  
    const newChatId = `chat_${userId}_${Date.now()}`;
    const newChat: ChatSession = { id: newChatId, messages: [] };
    setChatHistory((prev: ChatSession[]) => [...prev, newChat]);
    setActiveChatId(newChat.id);
    setMessages([]);
    console.log("📎 Created chat with ID:", newChatId);
  };
  

   

  
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  // const startNewChat = () => {
  //   const newChat: ChatSession = { id: String(Date.now()), messages: [] };
  //   setChatHistory((prev) => [...prev, newChat]);
  //   setActiveChatId(newChat.id);
  //   setMessages([]);
  // };


  // const toggleMenu = (chatId: string) => {
  //   setMenuOpen((prev: string | null) => (prev === chatId ? null : chatId));
  // };

  const toggleMenu = (chatId: string) => {
    setMenuOpen((prev) => (prev === chatId ? null : chatId));
  };

  
  // const deleteChat = async (userId: string, chatId: string) => {
  //   console.log("🧹 Deleting chat with ID:", chatId);
  //   if (!userId) {
  //     alert("User ID missing.");
  //     return;
  //   }
  
  //   if (confirm("Are you sure you want to delete this chat?")) {
  //     try {
  //       const res = await axios.delete(
  //         `http://localhost:5001/api/delete-chat/${userId}/${chatId}`
  //       );
  //       console.log(`✅ Chat ${chatId} deleted from DB`);
  
  //       if (res.data.success) {
  //         setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
          
  //         if (activeChatId === chatId) {
  //           setActiveChatId(null);
  //           setMessages([]);
  //         }
  //       } else {
  //         alert("Server responded but deletion failed.");
  //         console.warn("⚠️ Server delete response:", res.data);
  //       }
  //     } catch (err) {
  //       console.error("❌ Failed to delete chat:", err);
  //       alert("Failed to delete chat from server.");
  //     }
  //   }
  // };
  
  // const deleteChat = async (userId: string, chatId: string) => {
  //   console.log("🧹 Deleting chat with ID:", chatId);
  //   if (!userId) {
  //     alert("User ID missing.");
  //     return;
  //   }
  
  //   // ✅ Normalize ID (chat-1 → chat_1)
  //   const normalizedChatId = chatId.replace(/-/g, "_");
  
  //   if (confirm("Are you sure you want to delete this chat?")) {
  //     try {
  //       const res = await axios.delete(
  //         `http://localhost:5001/api/delete-chat/${userId}/${normalizedChatId}`
  //       );
  
  //       console.log(`✅ Chat ${normalizedChatId} deleted from DB`);
  
  //       if (res.data.success) {
  //         setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
  
  //         if (activeChatId === chatId) {
  //           setActiveChatId(null);
  //           setMessages([]);
  //         }
  //       } else {
  //         alert("Server responded but deletion failed.");
  //         console.warn("⚠️ Server delete response:", res.data);
  //       }
  //     } catch (err) {
  //       console.error("❌ Failed to delete chat:", err);
  //       alert("Failed to delete chat from server.");
  //     }
  //   }
  // };
  
  const deleteChat = async (userId: string, chatId: string) => {
    console.log("🧹 Deleting chat with ID:", chatId);
    if (!userId) {
      alert("User ID missing.");
      return;
    }
  
    if (confirm("Are you sure you want to delete this chat?")) {
      try {
        const res = await axios.delete(
          `http://localhost:5001/api/delete-chat/${userId}/${chatId}`
        );
  
        console.log(`✅ Chat ${chatId} deleted from DB`);
  
        if (res.data.success) {
          setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
  
          if (activeChatId === chatId) {
            setActiveChatId(null);
            setMessages([]);
          }
        } else {
          alert("Server responded but deletion failed.");
          console.warn("⚠️ Server delete response:", res.data);
        }
      } catch (err) {
        console.error("❌ Failed to delete chat:", err);
        alert("Failed to delete chat from server.");
      }
    }
  };
  
  
  
  const renameChat = (chatId: string) => {
    const newName = prompt("Enter a new name for this chat:");
    if (newName) {
      setChatHistory((prev) =>
        prev.map((chat) => (chat.id === chatId ? { ...chat, chat_name: newName } : chat))
      );
    }
  };

  const archiveChat = (chatId: string) => {
    console.log(`Chat ${chatId} archived.`);
  };

  const shareChat = (chatId: string) => {
    const shareLink = `https://yourapp.com/chat/${chatId}`;
    navigator.clipboard.writeText(shareLink);
    alert("Chat link copied to clipboard!");
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
        return `You are CyberBot, a highly professional cybersecurity assistant. You only answer questions related to cybersecurity, ethical hacking, privacy, and online safety. If a user asks about unrelated topics (e.g., general knowledge, weather, sports, or history), politely remind them that you specialize in cybersecurity and cannot answer that question.`;
  
      case "Friendly":
        return `You are CyberBot, a friendly and engaging cybersecurity assistant. You only discuss cybersecurity topics. If someone asks an unrelated question, respond with: "I'm here to help with cybersecurity topics! Do you have any security concerns?"`;
  
      case "Casual":
        return `You are CyberBot, an easygoing cybersecurity assistant. You explain security concepts in a simple way. If someone asks about an unrelated topic, say: "I focus on cybersecurity! Want to ask me something about online safety?"`;
  
      default:
        return `You are CyberBot, a strict cybersecurity assistant. You only discuss cybersecurity-related topics. If a user asks an unrelated question, kindly redirect them back to cybersecurity topics.`;
    }
  };
  
  
  // const handleSubmit = async () => {
  //   if (!value.trim()) return;

  //   const userId = localStorage.getItem("userId"); 
  //   if (!userId) {
  //       console.error("❌ Error: userId is missing!");
  //       setMessages((prev) => [
  //           ...prev,
  //           { text: "⚠️ Error: User not authenticated.", sender: "bot" },
  //       ]);
  //       return;
  //   }

  //   const userMessage: Message = { text: value, sender: "user" };

  //   // ✅ Ensure chat session exists before adding message
  //   if (!activeChatId) {
  //     const newChatId = `chat_${userId}_${Date.now()}`;
  //     const newChat: ChatSession = {
  //       id: newChatId,
  //       chat_name: "New Chat",
  //       messages: [userMessage],
  //     };
  //     setChatHistory((prev) => [...prev, newChat]);
  //     setActiveChatId(newChatId);
  //     setMessages([userMessage]);
    
  //     // ✅ Save new chat + first user message to MongoDB
  //     await axios.post("http://localhost:5001/api/save-chat-history", {
  //       userId,
  //       chatId: newChatId,
  //       chatName: "New Chat",
  //       messages: [
  //         {
  //           text: value,
  //           sender: "user",
  //           timestamp: new Date(),
  //         },
  //       ],
  //     });
  //   } else {
  //     setMessages((prev) => [...prev, userMessage]);
  //     setChatHistory((prev) =>
  //       prev.map((chat) =>
  //         chat.id === activeChatId
  //           ? { ...chat, messages: [...chat.messages, userMessage] }
  //           : chat
  //       )
  //     );
  //   }
    // 1️⃣ Summarize the bot's message in 4-6 words
    const summarizeResponse = async (botText: string): Promise<string | null> => {
      try {
        const summaryPrompt = `Summarize this into a short chat title:\n${botText}`;
        const response = await axios.post("http://localhost:5001/api/summarize", {
          prompt: summaryPrompt,
          model: "gpt-3.5-turbo",
        });
        return response.data?.response?.trim() ?? null;
      } catch (error) {
        console.error("❌ Error summarizing response:", error);
        return null;
      }
    };
    

  const handleSubmit = async () => {
  if (!value.trim()) return;

  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.error("❌ Error: userId is missing!");
    setMessages((prev) => [
      ...prev,
      { text: "⚠️ Error: User not authenticated.", sender: "bot" },
    ]);
    return;
  }

  const userMessage: Message = { text: value, sender: "user" };
  let currentChatId = activeChatId;

  if (!currentChatId) {
    currentChatId = `chat_${userId}_${Date.now()}`;
    const newChat: ChatSession = {
      id: currentChatId,
      chat_name: "New Chat",
      messages: [userMessage],
    };
    setChatHistory((prev) => [...prev, newChat]);
    setActiveChatId(currentChatId);
    setMessages([userMessage]);

    localStorage.setItem("activeChatId", currentChatId.toString());
  } else {
    setMessages((prev) => [...prev, userMessage]);
    setChatHistory((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );
  }

  const aiPersonality = localStorage.getItem("aiPersonality") || "Friendly";
  const personalityPrompt = getPersonalityPrompt(aiPersonality);
  const prompt = `${personalityPrompt}\n\nUser: ${value}\nAI: If the user's question is not related to cybersecurity, respond with: "I specialize in cybersecurity topics! Please ask me something related to online safety, ethical hacking, or privacy." Otherwise, answer the question.`;

  try {
    const res = await axios.post("http://localhost:5001/api/chat", {
      prompt,
      question: value,
      model,
      userId,
      chatId: currentChatId,
    });

    const botMessage: Message = {
      text: res.data?.response || "⚠️ Error: No response received",
      sender: "bot",
    };

    setMessages((prev) => [...prev, botMessage]);
    setChatHistory((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, botMessage] }
          : chat
      )
    );

    try {
      await axios.post("http://localhost:5001/api/save-chat-history", {
        userId,
        chatId: currentChatId,
        chatName: "User Chat",
        messages: [
          { text: value, sender: "user", timestamp: new Date() },
          { text: botMessage.text, sender: "bot", timestamp: new Date() },
        ],
      });
      console.log("✅ Chat history saved successfully.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Error saving chat history:", error.response?.data || error.message);
      } else {
        console.error("❌ Unexpected error:", error);
      }
    }

    const summary = await summarizeResponse(botMessage.text);
    console.log("🧠 Summary from summarizeResponse:", summary);

    setChatHistory((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, chat_name: summary || "New Chat" }
          : chat
      )
    );

    try {
      await axios.post("http://localhost:5001/api/update-chat-name", {
        userId,
        chatId: currentChatId,
        newName: summary,
      });
      console.log("✅ Chat name updated successfully.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Error updating chat name:", error.response?.data || error.message);
      } else {
        console.error("❌ Unexpected error:", error);
      }
    }

  } catch (error) {
    let message = "⚠️ Error: Could not get a response.";
    if (axios.isAxiosError(error)) {
      console.error("❌ Axios error:", error.response?.data || error.message);
      message = `⚠️ Axios Error: ${error.response?.data?.message || error.message}`;
    } else {
      console.error("❌ Unexpected error:", error);
    }
  
    const errorMessage: Message = {
      text: message,
      sender: "bot",
    };
  
    setMessages((prev) => [...prev, errorMessage]);
    setChatHistory((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, errorMessage] }
          : chat
      )
    );
  }  

  setValue(""); // ✅ Clear input
};



  //   const aiPersonality = localStorage.getItem("aiPersonality") || "Friendly"; 
  //   const responseLength = localStorage.getItem("responseLength") || "Medium";
  //   const personalityPrompt = getPersonalityPrompt(aiPersonality);
  //   const prompt = `${personalityPrompt}\n\nUser: ${value}\nAI: If the user's question is not related to cybersecurity, respond with: "I specialize in cybersecurity topics! Please ask me something related to online safety, ethical hacking, or privacy." Otherwise, answer the question.`;

    

  //   const maxTokens = responseLength === "Short" ? 100 : responseLength === "Long" ? 500 : 250;

  //   try {
  //       console.log("📡 Sending request to backend..."); 
  //       console.log("🔹 Request Data:", { prompt, model, maxTokens, userId });

  //       // const res = await axios.post("http://localhost:5001/api/chat", {
  //       //     question: prompt,
  //       //     model,
  //       //     // max_tokens: maxTokens, // prevent cutting off response before completing the response.
  //       //     userId, 
  //       //     chatId: activeChatId || `chat_${userId}_${Date.now()}`,
  //       // });

  //       const res = await axios.post("http://localhost:5001/api/chat", {
  //         prompt,
  //         question: value, // ✅ Use the user input from your state
  //         model,
  //         userId,
  //         chatId: activeChatId || `chat_${userId}_${Date.now()}`,
  //       });
        
  //       console.log("✅ Received response from backend:", res.data);

  //       const botMessage: Message = { text: res.data?.response || "⚠️ Error: No response received", sender: "bot" };

  //       // ✅ Immediately update chat history with bot response
  //       setMessages((prev) => [...prev, botMessage]);

  //       setChatHistory((prev) =>
  //           prev.map((chat) =>
  //               chat.id === activeChatId
  //                   ? { ...chat, messages: [...chat.messages, botMessage] }
  //                   : chat
  //           )
  //       );

  //       // ✅ Store the chat history in MongoDB
  //       await axios.post("http://localhost:5001/api/save-chat-history", {
  //         userId,
  //         chatId: activeChatId || `chat_${userId}_${Date.now()}`,
  //         chatName: "User Chat", // <-- This is currently not used on the backend
  //         messages: [
  //           { text: value, sender: "user", timestamp: new Date() },
  //           { text: botMessage.text, sender: "bot", timestamp: new Date() }
  //         ]
  //       });
        

  //   } catch (error) {
  //       console.error("❌ Error fetching response:", error);
  //       const errorMessage: Message = { text: "⚠️ Error: Could not get a response.", sender: "bot" };

  //       setMessages((prev) => [...prev, errorMessage]);

  //       setChatHistory((prev) =>
  //           prev.map((chat) =>
  //               chat.id === activeChatId
  //                   ? { ...chat, messages: [...chat.messages, errorMessage] }
  //                   : chat
  //           )
  //       );
  //   }

  //   setValue(""); // ✅ Clear input field
  // };

  useEffect(() => {
    console.log("✅ Active Chat ID:", activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // useEffect(() => {
  //   const storedUserId = localStorage.getItem("userId");
  //   if (!storedUserId) {
  //     console.warn("⚠️ No stored userId found.");
  //     return;
  //   }
  
  //   console.log(`🔍 Fetching chat history for userId: ${storedUserId}`);
  
  //   axios
  //     .get(`http://localhost:5001/api/chat-history/${storedUserId}`)
  //     .then((res) => {
  //       console.log("✅ Chat history response:", res.data);
  
  //       if (!res.data.success) {
  //         console.error("❌ API Error: Success flag is false.");
  //         return;
  //       }
  
  //       if (!Array.isArray(res.data.data)) {
  //         console.error("❌ API Error: Expected an array but got:", res.data.data);
  //         return;
  //       }

        
  //       setChatHistory(
  //         res.data.data
  //           .filter((chat: ChatData) => {
  //             if (!chat.chat_id && !chat.id) {
  //               console.warn("❗ Skipping chat with missing chat_id:", chat);
  //               return false;
  //             }
  //             return true;
  //           })
  //           .map((chat: ChatData, index: number) => ({
  //             id: chat.chat_id || chat.id, // fallback
  //             chat_name: chat.chat_name || `Chat ${index + 1}`,
  //             messages: Array.isArray(chat.messages) ? chat.messages : [],
  //           }))
  //       );
        
        
  
  //       // ✅ Auto-select the latest chat session
  //       if (res.data.data.length > 0) {
  //         const lastChat = res.data.data[res.data.data.length - 1];
  //         // const parsedLastId = Number(lastChat.chat_id);
  //         // setActiveChatId(!isNaN(parsedLastId) ? parsedLastId : `chat-${res.data.data.length}`);
  //         setActiveChatId(lastChat.chat_id); // ✅ use string ID directly
  //         setMessages(Array.isArray(lastChat.messages) ? lastChat.messages : []);
  //       } 
  //       else {
  //         console.warn("⚠️ No chat history found.");
  //       }
  //     })
  //     .catch((error) => console.error("❌ Error loading chat history:", error));
  // }, []);
  
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedActiveChatId = localStorage.getItem("activeChatId");
  
    if (!storedUserId) {
      console.warn("⚠️ No stored userId found.");
      return;
    }
  
    console.log(`🔍 Fetching chat history for userId: ${storedUserId}`);
  
    axios
      .get(`http://localhost:5001/api/chat-history/${storedUserId}`)
      .then((res) => {
        if (!res.data.success || !Array.isArray(res.data.data)) {
          console.error("❌ Invalid chat history response:", res.data);
          return;
        }
  
        const chatSessions: ChatSession[] = res.data.data
          .filter((chat: ChatData) => chat.chat_id || chat.id)
          .map((chat: ChatData, index: number) => ({
            id: chat.chat_id || chat.id,
            chat_name: chat.chat_name || `Chat ${index + 1}`,
            messages: Array.isArray(chat.messages) ? chat.messages : [],
          }));
  
        setChatHistory(chatSessions);
  
        // ✅ Restore last active chat from localStorage if available
        const foundChat = chatSessions.find(chat => chat.id === storedActiveChatId);
        if (foundChat) {
          setActiveChatId(foundChat.id);
          setMessages(foundChat.messages);
        } else if (chatSessions.length > 0) {
          const lastChat = chatSessions[chatSessions.length - 1];
          setActiveChatId(lastChat.id);
          setMessages(lastChat.messages);
        }
      })
      .catch((error) => console.error("❌ Error loading chat history:", error));
  }, []);
  

  
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userId"); // ✅ Remove user login info
    setChatHistory([]); // ✅ Reset UI state, but keep DB history
    setActiveChatId(null);
    setShowLogoutPopup(true); // ✅ Show a message
  
    setTimeout(() => {
      navigate("/login"); // ✅ Redirect to login after 2s
    }, 2000);
  };
  
  console.log("🔹 chatHistory:", chatHistory);
  console.log("🔹 activeChatId:", activeChatId);
  console.log("🔹 messages:", messages);

  const handleResetChats = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("No user ID found.");
      return;
    }
  
    try {
      // Call your backend to delete all chats for this user
      const res = await axios.delete(`http://localhost:5001/api/delete-all-chats/${userId}`);
      console.log("✅ Backend chat reset response:", res.data);
      localStorage.clear(); // clears everything
      // Clear frontend state
      setChatHistory([]);
      setActiveChatId(null);
      setMessages([]);
    } catch (err) {
      console.error("❌ Failed to delete chat history from DB:", err);
      alert("Failed to reset chats from backend.");
    }
  };
  
  


  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <input
            type="text"
            // id="search-input"
            // name="searchInput"
            placeholder="Search Your Chat History..."
            className="search-input"
          />
          <button className="new-chat-btn" onClick={startNewChat}>
          <img src="../public/assets/chat-plus.svg" alt="New Chat" />
          </button>


        </div>


        <div className="chat-history">
          {chatHistory.map((chat) => {
            console.log("🧪 Checking chat.id:", chat.id, "menuOpen:", menuOpen);
            return (
              <div
                key={chat.id}
                className={`chat-history-item ${menuOpen === chat.id ? "menu-open" : ""}`}
              >
                {/* <button
                  className={`chat-button ${activeChatId === chat.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    setMessages(chat.messages);
                  }}
                >
                  <span>{chat.chat_name || `Chat ${chat.id}`}</span>
                </button> */}

                <button
                  className={`chat-button ${activeChatId === chat.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    localStorage.setItem("activeChatId", chat.id.toString()); // ✅ Save to localStorage
                    setMessages(chat.messages);
                  }}
                >
                  <span>{chat.chat_name || `Chat ${chat.id}`}</span>
                </button>


                <button className="menu-button" onClick={() => toggleMenu(String(chat.id))}>⋮</button>

                {menuOpen === chat.id && (
                  <div className="chat-menu">
                    <ul>
                      <li onClick={() => shareChat(String(chat.id))}>Share</li>
                      <li onClick={() => renameChat(String(chat.id))}>Rename</li>
                      <li onClick={() => archiveChat(String(chat.id))}>Archive</li>
                      <li onClick={() => deleteChat(storedUserId, String(chat.id))} className="delete">Delete</li>
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button
          className="reset-chat-btn"
          onClick={() => {
            const confirmReset = window.confirm("Are you sure you want to delete all chats?");
            if (confirmReset) {
              handleResetChats();
            }
          }}
        >
          🧼 Reset Chats
        </button>

        
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
                    <li onClick={handleLogout} className="logout-button">
                      Log Out
                    </li>
                    {/* ✅ Logout button works properly */}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* ✅ Success Popup for Logout */}
            {showLogoutPopup && (
              <div className="popup-container">
                <div className="popup">
                  <h2>👋 See You Soon!</h2>
                  <p>🚪 You have successfully logged out.</p>
                </div>
              </div>
            )}
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {/* {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.sender === "bot" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          ))} */}
          {messages.map((msg: Message, index) => (
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
                // id="chat-input" // ✅ Add ID
                // name="chatInput" // ✅ Add Name
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