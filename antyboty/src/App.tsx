// import { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import "./css/App.css";
// // import chatPlusIcon from "../public/assets/chat-plus.svg"; // Absolute import for Vite

// // Import modal components for each page
// import DashboardPage from "./pages/DashboardPage";
// import AccountPage from "./pages/AccountPage";
// import SubscriptionPage from "./pages/SubscriptionPage";
// import NotificationsPage from "./pages/NotificationPage";
// import AIPreferencesPage from "./pages/AIPreferencePage";
// import PrivacyPage from "./pages/PrivacyPage";
// import HelpPage from "./pages/HelpPage";
// import SettingsModal from "../src/components/SettingsModel"; // ✅ Import new modal
// import remarkGfm from "remark-gfm";
// import rehypeRaw from "rehype-raw";
// //import LanguageToolApi from "languagetool-api";



// type Message = { 
//   text: string; 
//   sender: "user" | "bot"; 
//   timestamp?: Date | string; // Optional timestamp
// };

// // type ChatSession = {
// //   id: string;
// //   chat_name?: string;
// //   messages: Message[];
// // };

// type ChatData = {
//   id: number | string;  // ✅ Add `id` to match `ChatSession`
//   chat_id: number | string;
//   chat_name?: string;
//   messages: Message[];
// };

// export type ChatSession = {
//   id: number | string;
//   chat_name?: string;
//   messages: Message[];
// };




// function App() {
//   const [value, setValue] = useState<string>("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   //const userId = localStorage.getItem("userId"); // ✅ Get userId from storage
//   const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
//   // const [activeChatId, setActiveChatId] = useState<number | null>(null);
//   const [activeChatId, setActiveChatId] = useState<number | string | null>(null);
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [modalPage, setModalPage] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate(); // ✅ Added navigation
//   const [model, setModel] = useState<string>("gpt-4"); // Default model

//   const [menuOpen, setMenuOpen] = useState<string | null>(null);
//   const [botTyping, setBotTyping] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [copied, setCopied] = useState(false);
//   const [archivedChats, setArchivedChats] = useState<string[]>([]);

//   const correctText = async (input: string): Promise<string> => {
//     // const result = await LanguageToolApi.check({
//     //   text: input,
//     //   language: "en-US",
//     // });
  
//     // let corrected = input;
//     // for (const match of result.matches.reverse()) {
//     //   if (match.replacements.length > 0) {
//     //     const replacement = match.replacements[0].value;
//     //     corrected =
//     //       corrected.slice(0, match.offset) +
//     //       replacement +
//     //       corrected.slice(match.offset + match.length);
//     //   }
//     // }
//     // return corrected;
//     const res = await axios.post("http://localhost:5001/api/correct-text", { text: input });
//     return res.data.corrected;
//   };
  
  


//   //const userId = localStorage.getItem("userId");
//   //const storedUserId = localStorage.getItem("userId") || ""; // guaranteed to be a string

//   const fetchChatHistory = useCallback(async () => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) return;
  
//     try {
//       const res = await axios.get(`http://localhost:5001/api/chat-history/${userId}`);
//       // const chats = res.data.data.map((chat: ChatData) => ({
//       //   id: chat.chat_id,
//       //   //2
//       //   // chat_name: chat.chat_name?.trim() || `Chat ${index + 1}`,
//       //   chat_name: chat.chat_name || `Chat ${chat.chat_id}`,

//       //   messages: chat.messages,
//       // }));
//       const chats = res.data.data.map((chat: ChatData, index: number) => ({
//         id: chat.chat_id || chat.id || `temp_${index}`,
//         chat_name: chat.chat_name || `Chat ${chat.chat_id || chat.id || index}`,
//         messages: chat.messages || [],
//       }));
      
//       setChatHistory(chats);
//     } catch (err) {
//       console.error("❌ Error fetching chat history:", err);
//     }
//   }, []);
  
//   // 🔐 ✅ Redirect if user not logged in
//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) {
//       alert("You must be logged in.");
//       navigate("/login");
//     }
//   }, [navigate]); // Include navigate in the dependency array


//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as HTMLElement;
//       if (!target.closest(".chat-menu") && !target.closest(".menu-button")) {
//         setMenuOpen(null);
//       }
//     };
  
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
  
//   const startNewChat = async () => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) {
//       alert("User ID missing.");
//       return;
//     }
  
//     const newChatId = `chat_${userId}_${Date.now()}`;
//     const newChat: ChatSession = {
//       id: newChatId,
//       chat_name: "New Chat",
//       messages: [],
//     };
  
//     setChatHistory((prev) => [...prev, newChat]);
//     setActiveChatId(newChat.id);
//     setMessages([]);
//     localStorage.setItem("activeChatId", newChatId.toString());
  
//     try {
//       await axios.post("http://localhost:5001/api/save-chat-history", {
//         userId,
//         chatId: newChatId,
//         chatName: "New Chat",
//         messages: [], // empty at creation
//       });
//       console.log("✅ New chat saved to DB");
//     } catch (error) {
//       console.error("❌ Failed to save new chat to DB:", error);
//     }
//   };
  

//   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(e.target.value);
//   };

//   const toggleDropdown = () => {
//     requestAnimationFrame(() => {
//       setDropdownVisible((prev) => !prev);
//     });
//   };

//   const toggleMenu = (chatId: string) => {
//     console.log("👆 Menu button clicked for chatId:", chatId);
//     console.log("📂 Current chatHistory IDs:", chatHistory.map((c) => c.id));
//     console.log("📌 Current menuOpen:", menuOpen);

//     setMenuOpen((prev) => {
//       const newState = prev === chatId ? null : chatId;
//       console.log("🔁 New menuOpen state will be:", newState);
//       return newState;
//     });
//   };
  

  
//   const deleteChat = async (userId: string, chatId: string) => {
//     console.log("🧹 Deleting chat with ID:", chatId);
//     if (!userId) {
//       alert("User ID missing.");
//       return;
//     }
  
//     if (confirm("Are you sure you want to delete this chat?")) {
//       try {
//         const res = await axios.delete(
//           `http://localhost:5001/api/delete-chat/${userId}/${chatId}`
//         );
  
//         console.log(`✅ Chat ${chatId} deleted from DB`);
  
//         if (res.data.success) {
//           setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
  
//           if (activeChatId === chatId) {
//             setActiveChatId(null);
//             setMessages([]);
//           }
//         } else {
//           alert("Server responded but deletion failed.");
//           console.warn("⚠️ Server delete response:", res.data);
//         }
//       } catch (err) {
//         console.error("❌ Failed to delete chat:", err);
//         alert("Failed to delete chat from server.");
//       }
//     }
//   };
  
  
  
//   const renameChat = async (chatId: string) => {
//     const newName = prompt("Enter a new name for this chat:");
//     const userId = localStorage.getItem("userId");
  
//     if (newName && userId) {
//       try {
//         // 🔄 Update frontend immediately
//         setChatHistory((prev) =>
//           prev.map((chat) =>
//             chat.id === chatId ? { ...chat, chat_name: newName } : chat
//           )
//         );
  
//         // 🔄 Update backend
//         await axios.post("http://localhost:5001/api/update-chat-name", {
//           userId,
//           chatId,
//           newName,
//         });
  
//         // 🔄 Refetch latest chat history from backend
//         await fetchChatHistory();
  
//         console.log("✅ Chat name updated successfully.");
//       } catch (err) {
//         console.error("❌ Error renaming chat:", err);
//         alert("Failed to update chat name.");
//       }
//     }
//   };

//   const shareChat = (chatId: string) => {


//     const shareLink = `http://localhost:3000/chat/${chatId}`;
//     navigator.clipboard.writeText(shareLink);

//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };
    
  

//   const openModal = (page: string) => {
//     setModalPage(page);
//     setDropdownVisible(false);
//   };

//   const closeModal = () => {
//     setModalPage(null);
//   };

//   const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedModel = e.target.value;
//     setModel(selectedModel);
//     console.log("Model changed to:", selectedModel); // ✅ Debugging log
//   };

//   const getPersonalityPrompt = (personality: string) => {
//     switch (personality) {
//       case "Professional":
//         return `You are CyberBot, a highly professional cybersecurity assistant. You only answer questions related to cybersecurity, ethical hacking, privacy, and online safety. If a user asks about unrelated topics (e.g., general knowledge, weather, sports, or history), politely remind them that you specialize in cybersecurity and cannot answer that question.`;
  
//       case "Friendly":
//         return `You are CyberBot, a friendly and engaging cybersecurity assistant. You only discuss cybersecurity topics. If someone asks an unrelated question, respond with: "I'm here to help with cybersecurity topics! Do you have any security concerns?"`;
  
//       case "Casual":
//         return `You are CyberBot, an easygoing cybersecurity assistant. You explain security concepts in a simple way. If someone asks about an unrelated topic, say: "I focus on cybersecurity! Want to ask me something about online safety?"`;
  
//       default:
//         return `You are CyberBot, a strict cybersecurity assistant. You only discuss cybersecurity-related topics. If a user asks an unrelated question, kindly redirect them back to cybersecurity topics.`;
//     }
//   };
  
    
//     const summarizeResponse = async (botText: string, userText: string): Promise<string | null> => {
//       try {
//         const response = await axios.post("http://localhost:5001/api/summarize", {
//           messages: [
//             { text: userText, sender: "user" },
//             { text: botText, sender: "bot" }
//           ]
//         });
//         return response.data?.summary?.trim() ?? null;
//       } catch (error) {
//         console.error("❌ Error summarizing response:", error);
//         return null;
//       }
//     };


//   const handleSubmit = async () => {
//     if (!value.trim()) return;

//     const userId = localStorage.getItem("userId");
//     if (!userId) {
//       console.error("❌ Error: userId is missing!");
//       setMessages((prev) => [
//         ...prev,
//         { text: "⚠️ Error: User not authenticated.", sender: "bot" },
//       ]);
//       return;
//     }

//     const userMessage: Message = { text: value, sender: "user" };
//     setValue(""); // ✅ Clear input immediately after capturing the value

//     let currentChatId = activeChatId;

//     if (!currentChatId) {
//       currentChatId = `chat_${userId}_${Date.now()}`;
//       const newChat: ChatSession = {
//         id: currentChatId,
//         chat_name: "New Chat",
//         messages: [userMessage],
//       };
//       setChatHistory((prev) => [...prev, newChat]);
//       setActiveChatId(currentChatId);
//       setMessages([userMessage]);

//       localStorage.setItem("activeChatId", currentChatId.toString());
//     } else {
//       setMessages((prev) => [...prev, userMessage]);
//       setChatHistory((prev) =>
//         prev.map((chat) =>
//           chat.id === currentChatId
//             ? { ...chat, messages: [...chat.messages, userMessage] }
//             : chat
//         )
//       );
//     }

//     const aiPersonality = localStorage.getItem("aiPersonality") || "Friendly";
//     const personalityPrompt = getPersonalityPrompt(aiPersonality);
//     const prompt = `${personalityPrompt}\n\nUser: ${value}\nAI: If the user's question is not related to cybersecurity, respond with: "I specialize in cybersecurity topics! Please ask me something related to online safety, ethical hacking, or privacy." Otherwise, answer the question.`;

//     try {
//       setBotTyping(true);

//       let streamedText = "";
//       // setBotTyping(true);

//       const response = await fetch("http://localhost:5001/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           prompt,
//           question: value,
//           model,
//           userId,
//           chatId: currentChatId,
//         }),
//       });

//       if (!response.body) throw new Error("No response body");

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder("utf-8");

//       setMessages((prev) => [...prev, { text: "", sender: "bot" }]);

//       while (true) {
//         const { done, value: chunk } = await reader.read();
//         if (done) break;

//         const decodedChunk = decoder.decode(chunk, { stream: true });
//         const lines = decodedChunk.split("\n").filter((line) => line.startsWith("data: "));

//         for (const line of lines) {
//           const token = line.replace("data: ", "").trim();
//           if (token === "[DONE]") {
//             await reader.cancel();
//             break;
//           }
        
//           if (/^\d+\.\s/.test(token)) {
//             streamedText += `\n\n${token}`;
//           } else {
//             streamedText += token;
//           }
        
//           setMessages((prevMessages) => {
//             const newMessages = [...prevMessages];
//             const lastIndex = newMessages.length - 1;
        
//             if (newMessages[lastIndex]?.sender === "bot") {
//               const lastText = newMessages[lastIndex].text;
        
//               // let fixedToken = token;
              
//               // let fixedToken = sanitizeToken(token);
//               // const token = line.replace("data: ", "").trim();
//               // const cleanedToken = cleanStreamedToken(token);
//               // let fixedToken = sanitizeToken(cleanedToken);
//               let fixedToken = token;

        
//               // Add newlines before numbered items
//               if (/^\d+\.\s/.test(token)) {
//                 fixedToken = `\n\n${token}`;
//               }
        
//               // Fix bold titles before colons (streamed version)
//               fixedToken = fixedToken.replace(/^(\d+\.\s)([^:]+):/, '$1**$2:**');
        
//               const needsSpace =
//                 lastText &&
//                 !lastText.endsWith(" ") &&
//                 !fixedToken.startsWith(" ") &&
//                 !fixedToken.startsWith(".") &&
//                 !fixedToken.startsWith(",") &&
//                 !fixedToken.startsWith(":") &&
//                 !fixedToken.startsWith("!") &&
//                 !fixedToken.startsWith("?") &&
//                 !fixedToken.startsWith("\n");
        
//               const updatedText = lastText + (needsSpace ? " " : "") + fixedToken;
        
//               newMessages[lastIndex] = {
//                 ...newMessages[lastIndex],
//                 text: updatedText,
//               };
//             }
        
//             return newMessages;
//           });
//         }
        
//       }

//       setBotTyping(false);

//     // const cleaned = streamedText
//     //   .replace(/([a-zA-Z])\s([a-zA-Z])/g, '$1$2') // ONLY glue broken words
//     //   .trim();
//     let corrected = streamedText;
//     try {
//       corrected = await correctText(streamedText);
//     } catch (err) {
//       console.warn("⚠️ Grammar correction failed, using raw text:", err);
//     }
//     const cleaned = corrected.trim();

//     const botMessage: Message = {
//       text: cleaned,
//       sender: "bot",
//     };

//       setChatHistory((prev) =>
//         prev.map((chat) =>
//           chat.id === currentChatId
//             ? { ...chat, messages: [...chat.messages, botMessage] }
//             : chat
//         )
//       );

//       try {
//         const saveRes = await axios.post("http://localhost:5001/api/save-chat-history", {
//           userId,
//           chatId: currentChatId,
//           chatName: "New Chat",
//           messages: [
//             { text: value, sender: "user", timestamp: new Date() },
//             { text: botMessage.text, sender: "bot", timestamp: new Date() },
//           ],
//         });
        
//         const backendChatName = saveRes.data.chat_name;
//         console.log("✅ Chat history saved successfully.");
//         setChatHistory((prev) =>
//           prev.map((chat) =>
//             chat.id === currentChatId
//               ? { ...chat, chat_name: backendChatName }
//               : chat
//           )
//         );
        
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           console.error("❌ Error saving chat history:", error.response?.data || error.message);
//         } else {
//           console.error("❌ Unexpected error:", error);
//         }
//       }

//       const summary = await summarizeResponse(botMessage.text, value);
//       if (!summary) {
//         console.warn("⚠️ Skipping chat name update due to missing summary.");
//         return;
//       }
//       console.log("🧠 Summary from summarizeResponse:", summary);
      
//       try {
//         await axios.post("http://localhost:5001/api/update-chat-name", {
//           userId,
//           chatId: currentChatId,
//           newName: summary, // at the update chat name chat history name should be summarized name
//         });
//         console.log("✅ Chat name updated successfully.");


//         await fetchChatHistory();
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           console.error("❌ Error updating chat name:", error.response?.data || error.message);
//         } else {
//           console.error("❌ Unexpected error:", error);
//         }
//       }

//     } catch (error) {
//       let message = "⚠️ Error: Could not get a response.";
//       if (axios.isAxiosError(error)) {
//         console.error("❌ Axios error:", error.response?.data || error.message);
//         message = `⚠️ Axios Error: ${error.response?.data?.message || error.message}`;
//       } else {
//         console.error("❌ Unexpected error:", error);
//       }
    
//       const errorMessage: Message = {
//         text: message,
//         sender: "bot",
//       };
    
//       setMessages((prev) => [...prev, errorMessage]);
//       setChatHistory((prev) =>
//         prev.map((chat) =>
//           chat.id === currentChatId
//             ? { ...chat, messages: [...chat.messages, errorMessage] }
//             : chat
//         )
//       );
//     }  

//     setValue(""); // ✅ Clear input
//   };

//   useEffect(() => {
//     console.log("✅ Active Chat ID:", activeChatId);
//   }, [activeChatId]);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);
  
  
//   useEffect(() => {
//     // const storedUserId = localStorage.getItem("userId");
//     localStorage.getItem("userId")
//     const storedActiveChatId = localStorage.getItem("activeChatId");
  
//     if (!localStorage.getItem("userId")) {
//       console.warn("⚠️ No stored userId found.");
//       return;
//     }
  
//     console.log(`🔍 Fetching chat history for userId: ${localStorage.getItem("userId")}`);
  
//     axios
//       .get(`http://localhost:5001/api/chat-history/${localStorage.getItem("userId")}`)
//       .then((res) => {
//         if (!res.data.success || !Array.isArray(res.data.data)) {
//           console.error("❌ Invalid chat history response:", res.data);
//           return;
//         }

//         const chatSessions: ChatSession[] = res.data.data
//           // .filter((chat: ChatData) => chat.chat_id || chat.id)
//           .filter((chat: ChatData) => (chat.chat_id || chat.id) && Array.isArray(chat.messages))
//           .map((chat: ChatData, index: number) => ({
//             id: chat.chat_id || chat.id || `temp_${index}`, // fallback ID
//             chat_name: chat.chat_name?.trim() || `Chat ${index + 1}`,
//             messages: chat.messages || [],
//           }));
//           console.log("🧠 Processed chat sessions:", chatSessions);
//         //2

//         setChatHistory(chatSessions.reverse());

  
//         // ✅ Restore last active chat from localStorage if available
//         const foundChat = chatSessions.find(chat => chat.id === storedActiveChatId);
//         if (foundChat) {
//           setActiveChatId(foundChat.id);
//           setMessages(foundChat.messages);
//         } else if (chatSessions.length > 0) {
//           const lastChat = chatSessions[chatSessions.length - 1];
//           setActiveChatId(lastChat.id);
//           setMessages(lastChat.messages);
//         }
//       })
//       .catch((error) => console.error("❌ Error loading chat history:", error));
//   }, []);
  

  
//   const [showLogoutPopup, setShowLogoutPopup] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem("userId"); // ✅ Remove user login info
//     setChatHistory([]); // ✅ Reset UI state, but keep DB history
//     setActiveChatId(null);
//     setShowLogoutPopup(true); // ✅ Show a message
  
//     setTimeout(() => {
//       navigate("/login"); // ✅ Redirect to login after 2s
//     }, 2000);
//   };
  
//   console.log("🔹 chatHistory:", chatHistory);
//   console.log("🔹 activeChatId:", activeChatId);
//   console.log("🔹 messages:", messages);

//   const filteredChats = chatHistory
//   .filter(chat => !archivedChats.includes(String(chat.id))) // ✅ hide archived ones
//   .filter(chat =>
//     chat.chat_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     chat.messages.some(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   const archiveChat = (chatId: string) => {
//     setArchivedChats(prev => 
//       prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
//     );
//   };
  
//   useEffect(() => {
//     localStorage.setItem("archivedChats", JSON.stringify(archivedChats));
//   }, [archivedChats]);
  
//   useEffect(() => {
//     const stored = localStorage.getItem("archivedChats");
//     if (stored) setArchivedChats(JSON.parse(stored));
//   }, []);
  
  

//     // function formatBotMarkdown(text: string) {
//     //   return text
//     //     .replace(/(\d+)\.\s*/g, '\n\n$1. ') // Newlines before each number
//     //     .replace(/([^\n])\s*:\s*/g, '$1:\n') // Line break after colon
//     //     .replace(/\s{2,}/g, ' ') // Collapse extra spaces
//     //     .replace(/([a-zA-Z])\s([a-zA-Z])/g, '$1$2') // Fix broken words
//     //     .replace(/\n\n(\d+)\. ([^:]+):\n?/g, '\n\n$1. **$2:**\n    '); // Indent description
//     // }

//     function formatBotMarkdown(text: string): string {
//       let cleaned = text;
    
//       // 1. Fix broken hyphenated terms
//       cleaned = cleaned.replace(/\b([a-zA-Z]+)\s*-\s*([a-zA-Z]+)\b/g, "$1-$2");
    
//       // 2. Fix known phrases
//       cleaned = cleaned.replace(/\bman[-\s]?in[-\s]?the[-\s]?middle\b/gi, "man-in-the-middle");
//       cleaned = cleaned.replace(/\bzero[-\s]?day\b/gi, "zero-day");
//       cleaned = cleaned.replace(/\bdenial[-\s]?of[-\s]?service\b/gi, "denial-of-service");
//       cleaned = cleaned.replace(/\bsql\s?injection\b/gi, "SQL injection");
//       cleaned = cleaned.replace(/\bcrypto\s?jacking\b/gi, "cryptojacking");
//       cleaned = cleaned.replace(/\badvanced\s?persistent\s?threats?\b/gi, "Advanced Persistent Threats")
//       cleaned = cleaned.replace(/\b([a-zA-Z])\s([a-zA-Z]{3,})\b/g, '$1$2'); // catch stealth y → stealthy

//       if (/\b[a-zA-Z]\s[a-zA-Z]{3,}/.test(cleaned)) {
//         console.warn("🚨 Unclean token detected:", cleaned);
//       }
      
//       // 2b. Fix tokenization artifacts
//       cleaned = cleaned
//         .replace(/\b(M|m)al\s?ware\b/g, "Malware")
//         .replace(/\b(P|p)h\s?ishing\b/g, "Phishing")
//         .replace(/\b(R|r)ansom\s?ware\b/g, "Ransomware")
//         .replace(/\b(S|s)py\s?ware\b/g, "Spyware")
//         .replace(/\b(C|c)rypto\s?j\s?acking\b/g, "Cryptojacking")
//         .replace(/\b(D|d)en\s?ial\s?-\s?of\s?-\s?(S|s)ervice\b/g, "Denial-of-Service")
//         .replace(/\b(D|d)istributed\s?den\s?ial\s?-\s?of\s?-\s?(S|s)ervice\b/g, "Distributed Denial-of-Service")
//         .replace(/\b(A|a)dvanced\s?Persistent\s?Threats?\s?\(?\s?APTs?\s?\)?/gi, "Advanced Persistent Threats (APTs)")
//         .replace(/\b(I|i)nsider\s?threats?\b/g, "Insider threats")
//         .replace(/\b(D|d)ns\s?Tunneling\b/g, "DNS Tunneling")
//         .replace(/\b(T|t)ro\s?j\s?ans?\b/g, "Trojans")
//         .replace(/\b(A|a)d\s?ware\b/g, "Adware")
//         .replace(/\b(E|e)xp\s?lo\s?its?\b/g, "Exploits")
//         .replace(/\b(D|d)o\s?S\b/g, "DoS")
//         .replace(/\b(D|d)Do\s?S\b/g, "DDoS")
//         .replace(/\b(M|m)it\s?M\b/g, "MitM")
//         .replace(/\b(u|U)p-to\s*-\s*date\b/g, "up-to-date")
//         .replace(/\b(o|O)wners\s*'\s*/g, "owners'")
//         .replace(/\b(C|c)rypt\s?ov\s?iro\s?logy\b/g, "cryptovirology")
//         .replace(/\badvertis\s*advertisements\b/gi, "advertisements"); // merge-fix
    
//       // 3. Common malformed words & phrases
//       cleaned = cleaned
//         .replace(/\bperpet\s?ually\b/gi, "perpetually")
//         .replace(/\bkey\s?log\s?gers?\b/gi, "keyloggers")
//         .replace(/\bdoesn\s?'\s?t\b/gi, "doesn't")
//         .replace(/\bback\s?doors?\b/gi, "backdoors")
//         .replace(/\broot\s?kits?\b/gi, "rootkits")
//         .replace(/\bbot\s?nets?\b/gi, "botnets")
//         .replace(/\bfile\s?less\s?mal\s?ware\b/gi, "fileless malware")
//         .replace(/\breplic\s?ates?\b/gi, "replicates")
//         .replace(/\bkey\s?trokes?\b/gi, "keystrokes")
//         .replace(/\bdis\s?gu\s?is(es|ed|ing)?\b/gi, "disguis$1")
//         .replace(/\btam\s?per(ed|ing)?\b/gi, "tamper$1")
//         .replace(/\bco\s?vert\s?ly\b/gi, "covertly")
//         .replace(/\bdis\s?creet\s?ly\b/gi, "discreetly")
//         .replace(/\bre\s?stric\s?ts?\b/gi, "restricts")
//         .replace(/\ben\s?crypt(s|ed|ing)?\b/gi, "encrypt$1")
//         .replace(/\bad\s?vertis(e|ement|ing|ements|ers)?\b/gi, "advertis$1")
//         .replace(/\ble\s?git\s?imate\b/gi, "legitimate")
//         .replace(/\bpriv\s?ileged\b/gi, "privileged")
//         .replace(/\buna\s?uthorized\b/gi, "unauthorized")
//         .replace(/\bmon\s?itors?\b/gi, "monitors")
//         .replace(/\bcollec\s?ts?\b/gi, "collects")
//         .replace(/\binter\s?action\b/gi, "interaction")
//         .replace(/\bacc\s?ess\b/gi, "access")
//         .replace(/\bpass\s?word(s)?\b/gi, "password$1")
//         .replace(/\bcred\s?it\s?card\b/gi, "credit card")
//         .replace(/\bWorm\s?s\b/gi, "Worms")
//         .replace(/\bthemselves\b/gi, "themselves") // fix 'the mselves'
//         .replace(/\buser\s?'sdata\b/gi, "user's data")
//         .replace(/\bkeyst\s?roke\b/gi, "keystroke")
//         .replace(/\ba\s?ttackers?\b/gi, "attackers")
//         .replace(/\ba\s?ctivity\b/gi, "activity")
//         .replace(/\ba\s?dvertisements?\b/gi, "advertisements")
//         .replace(/\bA\s?set\b/gi, "A set");

    
//       // 4. Fix gluing of short prepositions/articles to real words
//       // cleaned = cleaned.replace(/\b(a|an|the|in|on|of|to|and|for|by)\s+([A-Z]?[a-z]{2,})\b/g, (_, article, word) => {
//       //   const glued = `${article}${word}`;
//       //   const safeWords = [
//       //     "android", "another", "anonymous", "analyze", "analytics", "andromeda",
//       //     "amazing", "affiliate", "against", "among", "anyone",
//       //     "account", "access", "address", "amount", "analysis",
//       //     "backup", "browser", "firewall", "endpoint", "application"
//       //   ];
//       //   return safeWords.includes(glued.toLowerCase()) ? glued : `${article} ${word}`;
//       // });
//       // Fix glued articles (a, an, the) only when lowercase and incorrectly joined
//      // Fix "a"/"an"/"the" at the start of a sentence if glued to next word
//       // Fix glued articles (a, an, the) when wrongly attached to next word (like "atype", "arobust")
//       // 4b. Fix glued articles at the start of words (e.g., atype → a type)
//       cleaned = cleaned.replace(/\b(a|an|the)(?=[A-Z]?[a-z]{3,})/g, (match, article) => {
//         const nextWord = cleaned.slice(cleaned.indexOf(match) + article.length).match(/^[A-Z]?[a-z]{3,}/)?.[0];
//         const knownCompounds = [
//           "another", "android", "analytics", "analyze", "anthem", "amazing",
//           "thermal", "therapy", "theory", "these", "those", "therefore"
//         ];
//         if (nextWord && knownCompounds.includes((article + nextWord).toLowerCase())) {
//           return article + nextWord;
//         }
//         return article + " ";
//       });




//       // 5. Possessives
//       cleaned = cleaned.replace(/\b([a-zA-Z]+)\s+'s\b/g, `$1's`);
    
//       // 6. Format numbered markdown bullets
//       cleaned = cleaned.replace(/\s*(\d+)\.\s*/g, "\n\n$1. ");
//       cleaned = cleaned.replace(/(\d+\.\s*)([^:\n]+):/g, "$1**$2:**");
    
//       // 7. Indent paragraphs under each bullet
//       cleaned = cleaned.replace(
//         /(^\d+\. \*\*[^:]+:\*\*.*?)(?=\n\d+\.|\n*$)/gs,
//         (block) =>
//           block
//             .split("\n")
//             .map((line, i) => (i === 0 ? line : `    ${line.trim()}`))
//             .join("\n")
//       );
    
//       // 8. Final cleanup
//       cleaned = cleaned
//         .replace(/[ ]{2,}/g, " ")        // collapse extra spaces
//         .replace(/(\S)\n(\S)/g, "$1 $2") // fix broken word line splits
//         .trim();
      
//         // 3b. Fix broken prefixes (like "a ccess", "a ttacker", "a dvertisements")
//       cleaned = cleaned
//       .replace(/\ba\s?ccess\b/gi, "access")
//       .replace(/\ba\s?ttack(ers?|ing)?\b/gi, "attack$1")
//       .replace(/\ba\s?llowed\b/gi, "allowed")
//       .replace(/\ba\s?dvertisements?\b/gi, "advertisements")
//       .replace(/\ba\s?rea\b/gi, "area")
//       .replace(/\ba\s?bout\b/gi, "about")
//       .replace(/\ba\s?gainst\b/gi, "against")
//       .replace(/\ba\s?ctivity\b/gi, "activity")
//       .replace(/\ba\s?ims?\b/gi, "aims")
//       .replace(/\ba\s?nother\b/gi, "another")
//       .replace(/\ba\s?llows?\b/gi, "allows");

//       // 4c. Fix glued articles at the **start of sentence** (like “Atype”)
//       cleaned = cleaned.replace(/(^|\n)([Aa]n?|[Tt]he)(?=[A-Z]?[a-z]{3,})/g, (match, prefix, article) => {
//       const offset = cleaned.indexOf(match) + prefix.length;
//       const nextWord = cleaned.slice(offset + article.length).match(/^[A-Z]?[a-z]{3,}/)?.[0] ?? "";
//       const glued = article + nextWord;
//       const knownSafe = ["another", "android", "analytics", "analyze", "andromeda", "amazing", "anthem", "against", "among"];
//       return knownSafe.includes(glued.toLowerCase()) ? match : `${prefix}${article} `;
//       });
//       // 9. Final recombination: fix any still-split verbs or adjectives
//       cleaned = cleaned.replace(/\b([a-z]{2,})\s([a-z]{2,})\b/gi, (match, part1, part2) => {
//         const combined = `${part1}${part2}`;
//         const safeCombos = [
//           "replicate", "restricts", "infects", "allows", "removes", "enables", "encrypts", "detects", "captures", "protects",
//           "monitors", "tracks", "installs", "modifies", "downloads", "disables", "blocks", "unwanted", "unauthorized",
//           "malicious", "activities", "software", "ransomware", "spyware", "adware"
//         ];
//         return safeCombos.includes(combined.toLowerCase()) ? combined : match;
//       });
//       // Ensure space after standalone articles ("A", "An", "The") if glued to a word
//       cleaned = cleaned.replace(/\b([Aa]n?|[Tt]he)(?=[A-Z]?[a-z]{3,})/g, (match, article) => {
//         return `${article} `;
//       });
//       cleaned = cleaned.replace(/\bA\s?(dware|dvertisement|dvertisements)\b/gi, (match, suffix) => {
//         const word = suffix.charAt(0).toUpperCase() + suffix.slice(1).toLowerCase();
//         return `An ${word}`; // optional: "An" if you'd rather match grammar, or "A" if you want to keep it simple
//       });
      




      

//       // 🛠 Fix "a"/"an"/"the" followed by a space and a split word (like "a ttack", "an other")
//       cleaned = cleaned.replace(/\b(a|an|the)\s+([a-z]{2,})\b/gi, (match, article, word) => {
//         const combined = `${article}${word}`;
//         const knownSafe = [
//           "another", "analyze", "android", "anthem", "anomaly",
//           "attack", "access", "activity", "advertisement", "advocate",
//           "theory", "therapy", "thermal", "theorem", "attach"
//         ];
//         return knownSafe.includes(combined.toLowerCase()) ? combined : `${article} ${word}`;
//       });

//       cleaned = cleaned
//       // existing replacements...
//       .replace(/\ba\s?gainst\b/gi, "against")
//       .replace(/\ba\s?ntivirus\b/gi, "antivirus")
//       .replace(/\ba\s?void\b/gi, "avoid")
//       .replace(/\bun\s?verified\b/gi, "unverified")
//       .replace(/\bdoesn\s?'\s?t\b/gi, "doesn't")
//       .replace(/\bstealth\s?y\s?and\b/gi, "stealthy and")
//       .replace(/\bAn\s?Dware\b/g, "Adware")
//       .replace(/\bAn\s?Dvertisements?\b/g, "Advertisements")

//       cleaned = cleaned
//       .replace(/\ba\s?ttach(ing|ed|es)?\b/gi, "attach$1")
//       .replace(/\bdoesn\s?'\s?t\s?need\b/gi, "doesn't need")
//       .replace(/\bth\s?ieves\b/gi, "thieves")
//       .replace(/\ba\s?ctions?\b/gi, "actions")
//       .replace(/\b[Ee]twork\b/g, "network")
//       .replace(/\bowners'knowledge\b/g, "owners' knowledge")
//       .replace(/\bdoesn\s?'\s?trely\b/gi, "doesn't rely")
//       .replace(/\ba\s?lways\b/gi, "always");
//       cleaned = cleaned
//       .replace(/\ba\s?ctivities\b/gi, "activities")
//       .replace(/\ba\s?lso\b/gi, "also")
//       .replace(/\bencrypt\s?s\b/gi, "encrypts")
//       .replace(/\buser\s?'\s?sdata\b/gi, "user's data")
//       .replace(/\b[Ss]crap\s?ing\b/g, "scraping")
//       .replace(/\bsystem\s?'\s?srandom\b/gi, "system's random")
//       .replace(/\bvictim\s?[’']\s?computer\b/gi, "victim's computer");
      
//       cleaned = cleaned
//       .replace(/\bTrojans\s+Horse\b/gi, "Trojan Horse");
//       cleaned = cleaned
//       .replace(/\bre\s?p\s?lic\s?a\s?ting\b/gi, "replicating")
//       .replace(/\bun\s?inf\s?ected\b/gi, "uninfected")
//       .replace(/\busers\s?'\s?systems\b/gi, "users' systems")
//       .replace(/\banother\s?'\s?scomputer\b/gi, "another's computer")
//       .replace(/\bmonitors\s?and\s?record(s)?\b/gi, "monitor and record$1")
//       .replace(/\buser\s?'\s?sk?eyboard\b/gi, "user's keyboard")
//       .replace(/\bAn\s+network\b/gi, "A network");


//       cleaned = cleaned
//       .replace(/\bvictim\s?'sdata\b/gi, "victim's data")
//       .replace(/\bcomputer\s?'skeyboard\b/gi, "computer's keyboard")
//       .replace(/\ba\s?llowed\b/gi, "allowed")
//       .replace(/\ba\s?rea\b/gi, "area");


//       cleaned = cleaned
//       .replace(/\b[Ii]t\s?a\s?ppears\b/g, "It appears")
//       .replace(/\buser\s?'sactivities\b/gi, "user's activities")
//       .replace(/\ba\s?bout\b/gi, "about")
//       .replace(/\bencrypt\ssuser\s?'sfiles\b/gi, "encrypts user's files")
//       .replace(/\ba\s?llows?\b/gi, "allows");

//       cleaned = cleaned.replace(/\bRAT\s?\(\s?Remote access Trojans\s?\)/gi, "Remote Access Trojan (RAT)");

//       cleaned = cleaned
//       .replace(/\ba\s?ffect\b/gi, "affect")
//       .replace(/system\s?'sperformance\b/gi, "system's performance")
//       .replace(/\ba\s?cross\b/gi, "across")
//       .replace(/\b[Ll]ock\s?s\b/g, "Locks")
//       .replace(/\b[Ss]ecret\s?ly\b/g, "secretly")
//       .replace(/\ba\s?lter\b/gi, "alter")
//       .replace(/\bit\s?'simportant\b/g, "it's important");

//       cleaned = cleaned
//       .replace(/\ba\s?utomatically\b/gi, "automatically")
//       .replace(/\ba\s?dvertising\b/gi, "advertising")
//       .replace(/\ba\s?ctively\b/gi, "actively")
//       .replace(/\bit\s?'salways\b/g, "it's always")
//       .replace(/\*{4}\s*/g, "**"); // Fix **** at beginning of list items

//       cleaned = cleaned
//       .replace(/\b[Ii]t\s?'s\b/gi, "it's")
//       .replace(/\buser\s?'s\s?keyst\s?rokes\b/gi, "user's keystrokes")
//       .replace(/\bkeyst\s?rokes?\b/gi, "keystrokes")
//       .replace(/\b(always remember to)/gi, "Always remember to");

//       // Fix generic broken contractions
//       cleaned = cleaned.replace(/\b(\w+)\s?'\s?([a-z]+)/g, `$1'$2`);
//       cleaned = cleaned
//       .replace(/\ba\s+(ttack(ers?|ing)|llows?|ims?|ccess|dvertisements?|bout|gainst|ctivity|nother|rea|bout)\b/gi, (_, word) => word);
//       cleaned = cleaned
//       .replace(/\b(reprodu)\s+cing\b/gi, "reproducing")
//       .replace(/\b(infect)\s+ing\b/gi, "infecting")
//       .replace(/\b(keyst)\s+rokes\b/gi, "keystrokes");

//       cleaned = cleaned
//       .replace(/\buser\s?'s\s?(keystrokes|data)/gi, "user's $1")
//       .replace(/\b(it|he|she|it)\s?'s\b/gi, "$1's");
      
//       cleaned = cleaned.replace(/\bumber\b/g, "number");

//       cleaned = cleaned.replace(/\b([a-z]{3,})\s+([a-z]{2,})\b/gi, (match, p1, p2) => {
//         const merged = p1 + p2;
//         const safeMerges = ["stealthy", "disguised", "reliable", "malicious", "infecting"];
//         return safeMerges.includes(merged.toLowerCase()) ? merged : match;
//       });
      
//       cleaned = cleaned
//       .replace(/\buser'sactivity\b/gi, "user's activity")
//       .replace(/\bencrypt\s?sthe\b/gi, "encrypts the")
//       .replace(/\ba\s?dministrative\b/gi, "administrative")
//       .replace(/\ban\s?ttackers?\b/gi, "attackers")
//       .replace(/\buser'sknowledge\b/gi, "user's knowledge")
//       .replace(/\ba\s?iming\b/gi, "aiming");
//       cleaned = cleaned
//       .replace(/\bit\s?'\s?s\b/gi, "It's") // Fix "it's" capitalization
//       .replace(/\bmis\s?leads?\b/gi, "misleads") // Fix "mis leads"
//       .replace(/\bims\b/gi, "aims") // Fix "It ims" → "It aims"
//       .replace(/\bconsumer'sconsent\b/gi, "consumer's consent") // Missing space
//       .replace(/\bAn\s+number\b/gi, "A number") // Grammar fix
//       .replace(/\bcomputer\s?’s\s?memory\b/gi, "computer’s memory") // Apostrophe spacing
//       .replace(/\ba\s?lmost\b/gi, "almost"); // "a lmost" artifact

//       // Format titles like "Virus: ..." → "**Virus:** ..."
//       cleaned = cleaned.replace(/(^|\n)([A-Z][a-z]+):/g, "$1**$2:**");

//       cleaned = cleaned
//       .replace(/\binfect\s?s\b/gi, "infects")
//       .replace(/\ba\s?ltering\b/gi, "altering")
//       .replace(/\btrick\s?ed\b/gi, "tricked")
//       .replace(/\bvictim\s?[’']\s?computer\b/gi, "victim’s computer")
//       .replace(/\bste\s?al\b/gi, "steal")
//       .replace(/\bhij\s?a\s?cked\b/gi, "hijacked")
//       .replace(/\bcyber\s?a\s?ttacks\b/gi, "cyberattacks");

//       cleaned = cleaned
//       .replace(/\bWorm\s?sare\b/gi, "Worms are")
//       .replace(/\bthe\s?mselves\b/gi, "themselves")
//       .replace(/\bcyber\s?t?attackers\b/gi, "cyberattackers")
//       .replace(/\bencrypt\s?syour\b/gi, "encrypts your")
//       .replace(/\bcomputer\s?'?s?memory\b/gi, "computer's memory")
//       .replace(/\blarge-scale\s?a\s?ttacks\b/gi, "large-scale attacks")
//       .replace(/\b[Ee]xploits\b/g, "exploits");

//       // Capitalize first letter after markdown bullets
//       cleaned = cleaned.replace(/(^|\n\n)(\d+\.\s+)([a-z])/g, (_, p1, p2, p3) => `${p1}${p2}${p3.toUpperCase()}`);

//       cleaned = cleaned
//       .replace(/\brestricts\s?saccess\b/gi, "restricts access")
//       .replace(/\bcreator\s?\(\s?s\s?\)/gi, "creator(s)")
//       .replace(/\bdisguises itself\b/g, "Disguises itself") // Capitalize Trojan definition
//       .replace(/\brootkits\b/g, "Rootkits")
//       .replace(/\bbotnets\b/g, "Botnets");

//       cleaned = cleaned.replace(/(^|\n\n)(\d+\.\s+)([a-z])/g, (_, pre, bullet, char) => `${pre}${bullet}${char.toUpperCase()}`);

//       cleaned = cleaned
//       .replace(/\bowner'sknowledge\b/gi, "owner's knowledge")
//       .replace(/\bcomputer's memory\b/gi, "the computer's memory")
//       .replace(/\balways make sure\b/gi, "Always make sure")
//       .replace(/Trojans: A type of Malware that Disguises/gi, "Trojans: A type of Malware that disguises")
//       .replace(/\bkeyloggers:/gi, "Keyloggers:");


//       cleaned = cleaned.replace(/^([a-z])/, (m) => m.toUpperCase()); // Capitalize start
//       cleaned = cleaned.replace(/\n([a-z])/g, (m) => "\n" + m.toUpperCase()); // Capitalize each line start

//       cleaned = cleaned
//       .replace(/\ba\s?ccessing\b/gi, "accessing")
//       .replace(/\bowners'knowledge\b/gi, "owners' knowledge")
//       .replace(/\bfileless malware\b/gi, "Fileless Malware")
//       .replace(/\bkeystrokes typed on a specific computer's keyboard\b/gi, "user's keystrokes");

//       const malwareTypes = [
//         "Virus", "Worm", "Trojans", "Spyware", "Ransomware",
//         "Adware", "Botnets", "Rootkits", "Keyloggers", "Fileless Malware"
//       ];
      
//       for (const type of malwareTypes) {
//         const regex = new RegExp(`\\b${type.toLowerCase()}\\b`, "gi");
//         cleaned = cleaned.replace(regex, type);
//       }
      
      
//       if (/\b[a-zA-Z]\s[a-zA-Z]{2,}/.test(cleaned)) {
//         console.warn("🚨 Token artifact still present:", cleaned.match(/\b[a-zA-Z]\s[a-zA-Z]{2,}/g));
//       }
      
//       cleaned = cleaned
//       .replace(/\bit'scrucial\b/gi, "it's crucial")
//       .replace(/\ba\s?pplications\b/gi, "applications")
//       .replace(/\bfileless malware\b/gi, "Fileless Malware");

//       cleaned = cleaned
//       .replace(/\bit\s?'s\s?crucial\b/gi, "it's crucial")
//       .replace(/\ba\s?pplications\b/gi, "applications");
//       cleaned = cleaned
//       .replace(/\bbe\s?a\s?ware\b/gi, "be aware")
//       .replace(/\b[Dd]isguises\b/g, "disguises")
//       .replace(/\ba\s?nnoying\b/gi, "annoying")
//       .replace(/\broot\s?kit\b/gi, "rootkit")
//       .replace(/\bthreat\s?a\s?ctor\b/gi, "threat actor")
//       .replace(/\ba\s?dministration\b/gi, "administration");

//       // Normalize title casing across items
//       cleaned = cleaned.replace(/\bfileless\s+Malware\b/gi, "Fileless malware");
//       cleaned = cleaned
//       .replace(/\bbe\s?a\s?ware\b/gi, "be aware")
//       .replace(/\b[Dd]isguises\b/g, "disguises")
//       .replace(/\ba\s?nnoying\b/gi, "annoying")
//       .replace(/\broot\s?kit\b/gi, "rootkit")
//       .replace(/\bthreat\s?a\s?ctor\b/gi, "threat actor")
//       .replace(/\ba\s?dministration\b/gi, "administration");

//       // Normalize title casing across items
//       cleaned = cleaned.replace(/\bfileless\s+Malware\b/gi, "Fileless malware");

//       cleaned = cleaned
//       .replace(/\ba\s?ltogether\b/gi, "altogether")
//       .replace(/\ba\s?voiding\b/gi, "avoiding")
//       .replace(/\bcollects\s+sensitive\s+data\b/gi, "collect sensitive data")
//       .replace(/\b[Tt]his is a software\b/g, "This is software")
//       .replace(/\b[Ff]ileless\s+[Mm]alware\b/g, "Fileless malware");

//       // Fix plural mismatches
//       cleaned = cleaned
//       .replace(/\bTrojans:\s*It is\b/gi, "Trojans: These are")
//       .replace(/\bBotnets:\s*This is\b/gi, "Botnets: These are")
//       .replace(/\bKeyloggers:\s*These are a type\b/gi, "Keyloggers: These are tools")
//       .replace(/\bKeyloggers:\s*This is\b/gi, "Keyloggers: These are tools")
//       .replace(/\bmalware\s+computer program\b/gi, "malware program");

//       cleaned = cleaned
//       // Fix common token splits
//       .replace(/\ba\s?nti\s?-\s?m\s?al\s?ware\b/gi, "anti-malware")
//       .replace(/\bA\s?dvertisements\b/g, "Advertisements")
//       .replace(/\ba\s?utonomous\b/gi, "autonomous")
//       .replace(/\bt\s?tackers\b/gi, "attackers")

//       // Fix article + noun combos
//       .replace(/\bBots:\s*A\s?utonomous\b/g, "Bots: Autonomous")

//       // Grammar/style fixes
//       .replace(/\bkeystrokes made on a specific computer's keyboard\b/g, "keystrokes made on a user's computer")
//       .replace(/\bare types of surveillance technology\b/g, "are surveillance tools")
//       .replace(/\btype of Malware that prevents users from accessing\b/g, "type of malware that blocks access to")

//       // Capitalization consistency
//       .replace(/\bMalware\b(?![.:])/g, "malware")
//       .replace(/\bttackers\b/g, "attackers");


        
//       return cleaned;
//     }
//     // function sanitizeToken(token: string): string {
//     //   return token
//     //     .replace(/\b(I|i)nfect\s?ing\b/g, "infecting")
//     //     .replace(/\bR\s?ansom\s?ware\b/gi, "Ransomware")
//     //     .replace(/\bWorm\s?s\b/gi, "Worms")
//     //     .replace(/\bkey\s?strokes\b/gi, "keystrokes")
//     //     .replace(/\b(T|t)rojans?\b/g, "Trojans")
//     //     .replace(/\b(root\s?kits?)\b/gi, "rootkits")
//     //     .replace(/\b(bot\s?nets?)\b/gi, "botnets")
//     //     .replace(/\b(ad\s?ware)\b/gi, "Adware")
//     //     .replace(/\b(spy\s?ware)\b/gi, "Spyware")
//     //     .replace(/\b(file\s?less\s?mal\s?ware)\b/gi, "fileless malware")
//     //     .replace(/\b(C|c)yber\s?criminals?\b/gi, "cybercriminals")
//     //     .replace(/\b(A|a)nti\s?-\s?(M|m)al\s?ware\b/g, "anti-malware")
//     //     .replace(/\binfect\s?ing\b/gi, "infecting")
//     //     .replace(/\bworm\s?s\b/gi, "worms")
//     //     .replace(/\battackers\s?'s\b/g, "attackers' control")
//     //     .replace(/\ba\s?robust\b/gi, "a robust")
//     //     .replace(/\ba\s?computer\b/gi, "a computer");


//     // }
//     // function cleanStreamedToken(token: string): string {
//     //   return token
//     //     .replace(/([a-zA-Z])\s([a-zA-Z])/g, '$1$2') // glue simple splits
//     //     .replace(/\b(R|r)\s?ansom\s?ware\b/g, "Ransomware")
//     //     .replace(/\b(T|t)roj\s?ans?\b/g, "Trojans")
//     //     .replace(/\b(K|k)ey\s?log\s?gers?\b/g, "keyloggers")
//     //     .replace(/\b(M|m)al\s?ware\b/g, "Malware")
//     //     .replace(/\b(M|m)al\s?vertising\b/g, "Malvertising")
//     //     .replace(/\b(A|a)nti\s?-\s?(M|m)al\s?ware\b/g, "anti-malware")
//     //     .replace(/\b(R|r)e\s?p\s?lic\s?ates\b/g, "replicates")
//     //     .replace(/\b(R|r)es\s?id\s?es\b/g, "resides")
//     //     .replace(/\b(S|s)tealth\s?y\b/g, "stealthy")
//     //     .replace(/\b(I|i)nfect\s?ing\b/g, "infecting")
//     //     .replace(/\b(W|w)orm\s?s\b/g, "Worms")
//     //     .replace(/\b(D|d)amag\s?ing\b/g, "damaging")
//     //     .replace(/\b(D|d)isguis\s?ed\b/g, "disguised")
//     //     .replace(/\b(A|a)ttack\s?ers?\b/g, "attackers")
//     //     .replace(/\binfect\s?ing\b/gi, "infecting")
//     //     .replace(/\bworm\s?s\b/gi, "worms")
//     //     .replace(/\battackers\s?'s\b/g, "attackers' control")
//     //     .replace(/\ba\s?robust\b/gi, "a robust")
//     //     .replace(/\ba\s?computer\b/gi, "a computer")
//     //     .replace(/\bA\s?type\b/gi, "a type")
//     //     .replace(/\bA\s?covert\b/gi, "a covert")
//     //     .replace(/\bA\s?computer\b/gi, "a computer")
//     //     .replace(/\bA\s?browser\b/gi, "a browser")
//     //     .replace(/\bA\s?bot\s?net\b/gi, "a botnet")
//     //     .replace(/\bA\s?program\b/gi, "a program")
//     //     .replace(/\bAn\s?ormal\b/gi, "a normal")
//     //     .replace(/\bA\s?reliable\b/gi, "a reliable")
//     //     .replace(/\ba\s?dvertising\b/gi, "advertising")
//     //     .replace(/\ba\s?dministrative-level\b/gi, "administrative-level")
//     //     .replace(/\buser\s?'skeyst\s?rokes\b/gi, "user's keystrokes")
//     //     .replace(/\bdon\s?'tclick\b/gi, "don't click")
//     //     .replace(/\bcomputer\s?'shard\b/gi, "computer's hard");


//     // }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
  
  
  
  

//   return (
//     <div className="chat-container">
//       {/* Sidebar */}
//       <div className="chat-sidebar">
//         <div className="sidebar-header">
//          {/*  <input
//             type="text"
//             // id="search-input"
//             // name="searchInput"
//             placeholder="Search Your Chat History..."
//             className="search-input"
//           />*/}
//           <input
//             type="text"
//             placeholder="Search Your Chat History..."
//             className="search-input"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />

//           <button className="new-chat-btn" onClick={startNewChat}>
//           <img src="/assets/chat-plus.svg" alt="New Chat" />
//           </button>


//         </div>


//         <div className="chat-history">
//           {filteredChats.map((chat, index) => {
//             console.log("🧪 Checking chat.id:", String(chat.id), "menuOpen:", menuOpen);
//             const safeId = chat.id || `fallback-${index}`;
//             return (
//               // <div
//               //   key={chat.id}
//               //   // className={`chat-history-item ${menuOpen === chat.id ? "menu-open" : ""}`}
//               //   className={`chat-history-item ${menuOpen === safeId ? "menu-open" : ""}`}
//               // >
//               <div
//                 key={safeId}
//                 // className={`chat-history-item ${menuOpen === chat.id ? "menu-open" : ""}`}
//                 className={`chat-history-item ${menuOpen === safeId ? "menu-open" : ""}`}
//               >
//                 {/* <button
//                   className={`chat-button ${activeChatId === chat.id ? "active" : ""}`}
//                   onClick={() => {
//                     setActiveChatId(chat.id);
//                     setMessages(chat.messages);
//                   }}
//                 >
//                   <span>{chat.chat_name || `Chat ${chat.id}`}</span>
//                 </button> */}

//                 <button
//                   className={`chat-button ${activeChatId === chat.id ? "active" : ""}`}
//                   onClick={() => {
//                     setActiveChatId(chat.id);
//                     localStorage.setItem("activeChatId", chat.id.toString()); // ✅ Save to localStorage
//                     setMessages(chat.messages);
//                   }}
//                 >
//                   {/* <span>{chat.chat_name || `Chat ${chat.id}`}</span> */}
//                   <span title={chat.chat_name}>
//                     {chat.chat_name
//                       ? chat.chat_name.split(" ").slice(0, 4).join(" ") + (chat.chat_name.split(" ").length > 4 ? "..." : "")
//                       : chat.messages?.[0]?.text.split(" ").slice(0, 4).join(" ") + "..." || `Chat ${chat.id}`}
//                   </span>

//                 </button>
                



//                 <button 
//                   className="menu-button"
//                   onClick={(e) => {
//                     e.stopPropagation(); // ⛔ Prevents event from reaching document
//                     toggleMenu(String(chat.id));
//                   }}
//                 >
//                 ⋮</button>


//                 {String(menuOpen) === String(chat.id) && (
//                   <div 
//                   className="chat-menu"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     console.log("✅ Inside chat-menu for:", chat.id);
//                   }}
                  
//                   >
//                     <ul>
//                       <li onClick={() => shareChat(String(chat.id))}>Share</li>
//                       <li onClick={() => renameChat(String(chat.id))}>Rename</li>
//                       <li onClick={() => archiveChat(String(chat.id))}>Archive</li>
//                       <li onClick={() => deleteChat(localStorage.getItem("userId") || "", String(chat.id))} className="delete">Delete</li>
//                     </ul>
//                     {copied && <div className="copy-popup">🔗 Link copied!</div>}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
        
//         {/* <button
//           className="reset-chat-btn"
//           onClick={() => {
//             const confirmReset = window.confirm("Are you sure you want to delete all chats?");
//             if (confirmReset) {
//               handleResetChats();
//             }
//           }}
//         >
//           🧼 Reset Chats
//         </button> */}

        
//         </div>

//       {/* Main Chat Area */}
//       <div className="chat-main">
//         <div className="sidebar-title2">
//           <div className="title">CYBERBOT</div>
//           {/* LLM Model Dropdown */}
//           <div className="llm-dropdown-container">
//             <label htmlFor="llm-model" className="llm-label">
//               Select AI Model:
//             </label>
//             <select
//               id="llm-model"
//               className="llm-dropdown"
//               value={model}
//               onChange={handleModelChange} // ✅ Updates the model state
//             >
//               <option value="gpt-4">GPT-4</option>
//               <option value="gpt-3.5-turbo">GPT-3.5-Turbo</option>
//               <option value="claude-2">Claude 2</option>
//               <option value="gemini">Gemini</option>
//               <option value="securebert">SecureBERT</option> {/* 👈 Add this */}
//             </select>
//           </div>

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
//                     {/* <li onClick={() => openModal("dashboard")}>Dashboard</li>
//                     <li onClick={() => openModal("account")}>Account Settings</li>
//                     <li onClick={() => openModal("subscription")}>Subscription</li>
//                     <li onClick={() => openModal("notifications")}>Notifications</li>
//                     <li onClick={() => openModal("ai-preferences")}>AI Preferences</li>
//                     <li onClick={() => openModal("privacy")}>Privacy</li>
//                     <li onClick={() => openModal("help")}>Help</li>
//                     <li onClick={handleLogout} className="logout-button">
//                       Log Out
//                     </li> */}
//                     <li onClick={() => setModalPage("settings")}>Settings</li>
//                     <li onClick={() => setModalPage("privacy")}>Privacy</li>
//                     <li onClick={() => setModalPage("help")}>Help</li>
//                     <li onClick={handleLogout} className="logout-button">Log Out</li>
//                     {/* ✅ Logout button works properly */}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//           {/* ✅ Success Popup for Logout */}
//             {showLogoutPopup && (
//               <div className="popup-container">
//                 <div className="popup">
//                   <h2>👋 See You Soon!</h2>
//                   <p>🚪 You have successfully logged out.</p>
//                 </div>
//               </div>
//             )}
//         </div>

//         {/* Chat Messages */}
//         <div className="chat-messages">
//           {/* {messages.map((msg, index) => (
//             <div key={index} className={`message ${msg.sender}`}>
//               {msg.sender === "bot" ? (
//                 <ReactMarkdown>{msg.text}</ReactMarkdown>
//               ) : (
//                 msg.text
//               )}
//             </div>
//           ))} */}
//           {/* {messages.map((msg: Message) => (
//             <div key={`${msg.timestamp}-${msg.text}`} className={`message ${msg.sender}`}>
//               {msg.sender === "bot" ? (
//                 <ReactMarkdown
//                   children={msg.text}
//                   remarkPlugins={[remarkGfm]} // ✅ Enables proper list + bold + newline handling
//                 />
//               ) : (
//                 msg.text
//               )}
//             </div>
//           ))} */}
//           {messages.map((msg: Message, index: number) => {
//             const isBot = msg.sender === "bot";
//             // const formattedText = isBot
//             //   ? //msg.text
//             //   formatBotMarkdown(msg.text)
//             //       // .replace(/(\d+)\.\s*/g, '\n\n$1. ')
//             //       // .replace(/([^\n])\s*:\s*/g, '$1:\n')
//             //       // .replace(/\s{2,}/g, ' ')
//             //       // .replace(/\n\n(\d+)\. ([^:]+):/g, '\n\n$1. **$2:**')
//             //   : msg.text;
//             const formattedText = isBot ? formatBotMarkdown(msg.text) : msg.text

//             return (
//               // <div key={`${msg.timestamp}-${msg.text}`} className={`message ${msg.sender}`}>
//               //   {isBot ? (
//               //     <ReactMarkdown
//               //     // children={formattedText}
//               //     children={formatBotMarkdown(msg.text)} // format right here
//               //     remarkPlugins={[remarkGfm]}
//               //     rehypePlugins={[rehypeRaw]} // ✅ allows HTML in markdown
//               //     linkTarget="_blank" // optional: open links in new tab
//               //   />
                
//               //   ) : (
//               //     msg.text
//               //   )}
//               // </div>
//               <div key={`${msg.sender}-${index}`} className={`message ${msg.sender}`}>

//                 {isBot ? (
//                   <ReactMarkdown
//                     children={formattedText}
//                     remarkPlugins={[remarkGfm]}
//                     rehypePlugins={[rehypeRaw]}
//                     // ❌ remove `linkTarget="_blank"` — it's not valid for ReactMarkdown
//                   />
//                 ) : (
//                   msg.text
//                 )}
//               </div>
//             );
//           })}

//           {botTyping && (
//             <div className="message bot typing-indicator">
//               <em>CyberBot is typing...</em>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Chat Footer */}
//         <div className="chat-footer-container">
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
//                 // id="chat-input" // ✅ Add ID
//                 // name="chatInput" // ✅ Add Name
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
//       {modalPage === "settings" && (
//         <SettingsModal
//           onClose={closeModal}
//           openModal={openModal}
//         />
//       )}


//       {modalPage === "dashboard" && <DashboardPage onClose={() => setModalPage(null)} />}
//       {modalPage === "account" && <AccountPage onClose={() => setModalPage(null)} />}
//       {modalPage === "subscription" && <SubscriptionPage onClose={() => setModalPage(null)} />}
//       {modalPage === "notifications" && <NotificationsPage onClose={() => setModalPage(null)} />}
//       {modalPage === "ai-preferences" && <AIPreferencesPage onClose={() => setModalPage(null)} />}
//       {modalPage === "privacy" && <PrivacyPage onClose={() => setModalPage(null)} />}
//       {modalPage === "help" && <HelpPage onClose={() => setModalPage(null)} />}

//     </div>
//   );
// }

// export default App;







import { useState, useEffect, useRef, useCallback } from "react";
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
import SettingsModal from "../src/components/SettingsModel"; // ✅ Import new modal
import SubscriptionModal from "../src/components/SubscriptionModal"; // ✅ Import new modal

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
  const [botTyping, setBotTyping] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [archivedChats, setArchivedChats] = useState<string[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);


  


  //const userId = localStorage.getItem("userId");
  //const storedUserId = localStorage.getItem("userId") || ""; // guaranteed to be a string

  const fetchChatHistory = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
  
    try {
      const res = await axios.get(`http://localhost:5001/api/chat-history/${userId}`);
      // const chats = res.data.data.map((chat: ChatData) => ({
      //   id: chat.chat_id,
      //   //2
      //   // chat_name: chat.chat_name?.trim() || `Chat ${index + 1}`,
      //   chat_name: chat.chat_name || `Chat ${chat.chat_id}`,

      //   messages: chat.messages,
      // }));
      const chats = res.data.data.map((chat: ChatData, index: number) => ({
        id: chat.chat_id || chat.id || `temp_${index}`,
        chat_name: chat.chat_name || `Chat ${chat.chat_id || chat.id || index}`,
        messages: chat.messages || [],
      }));
      
      setChatHistory(chats);
    } catch (err) {
      console.error("❌ Error fetching chat history:", err);
    }
  }, []);
  
  // 🔐 ✅ Redirect if user not logged in
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.warn("⚠️ userId missing. Possibly due to cleared localStorage.");
      alert("You must be logged in.");
      navigate("/login");
    }
  }, [navigate]); // Include navigate in the dependency array


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".chat-menu") && !target.closest(".menu-button")) {
        setMenuOpen(null);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  useEffect(() => {
    const handleClickOutsideDropdown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".navbar-user") && !target.closest(".dropdown-menu")) {
        setDropdownVisible(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => document.removeEventListener("mousedown", handleClickOutsideDropdown);
  }, []);
  
  const startNewChat = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID missing.");
      return;
    }
      // Check if there's already an empty "New Chat" in history
    const hasEmptyNewChat = chatHistory.some(chat =>
      chat.chat_name === "New Chat" && chat.messages.length === 0
    );

    if (hasEmptyNewChat) {
      console.warn("⚠️ You already have an unused 'New Chat'.");
      return; // Prevent adding another one
    }
  
    const newChatId = `chat_${userId}_${Date.now()}`;
    const newChat: ChatSession = {
      id: newChatId,
      chat_name: "New Chat",
      messages: [],
    };
  
    setChatHistory((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
    setMessages([]);
    localStorage.setItem("activeChatId", newChatId.toString());
  
    // try {
    //   await axios.post("http://localhost:5001/api/save-chat-history", {
    //     userId,
    //     chatId: newChatId,
    //     chatName: "New Chat",
    //     messages: [], // empty at creation
    //   });
    //   console.log("✅ New chat saved to DB");
    // } catch (error) {
    //   console.error("❌ Failed to save new chat to DB:", error);
    // }
  };
  

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const toggleDropdown = () => {
    requestAnimationFrame(() => {
      setDropdownVisible((prev) => !prev);
    });
  };

  const toggleMenu = (chatId: string) => {
    console.log("👆 Menu button clicked for chatId:", chatId);
    console.log("📂 Current chatHistory IDs:", chatHistory.map((c) => c.id));
    console.log("📌 Current menuOpen:", menuOpen);

    setMenuOpen((prev) => {
      const newState = prev === chatId ? null : chatId;
      console.log("🔁 New menuOpen state will be:", newState);
      return newState;
    });
  };
  

  
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
  
  
  
  const renameChat = async (chatId: string) => {
    const newName = prompt("Enter a new name for this chat:");
    const userId = localStorage.getItem("userId");
  
    if (newName && userId) {
      try {
        // 🔄 Update frontend immediately
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === chatId ? { ...chat, chat_name: newName } : chat
          )
        );
  
        // 🔄 Update backend
        await axios.post("http://localhost:5001/api/update-chat-name", {
          userId,
          chatId,
          newName,
        });
  
        // 🔄 Refetch latest chat history from backend
        await fetchChatHistory();
  
        console.log("✅ Chat name updated successfully.");
      } catch (err) {
        console.error("❌ Error renaming chat:", err);
        alert("Failed to update chat name.");
      }
    }
  };
  

  // const shareChat = (chatId: string) => {
  //   const shareLink = `http://localhost:3000/chat/${chatId}`; // Replace this with my real domain later when I deploy it in cloud service
  //   navigator.clipboard.writeText(shareLink);
  //   alert("✅ Chat link copied to clipboard!");
  //   setCopied(true);
  //   setTimeout(() => setCopied(false), 2000);
  // };

  const shareChat = (chatId: string) => {
    // const chat = chatHistory.find((c) => c.id === chatId);
    // const fullName = chat?.chat_name?.trim() || `Chat ${chatId}`;
    // const shareLink = `http://localhost:3000/chat/${chatId}`;
  
    // const content = `${fullName}\n${shareLink}`;
    // navigator.clipboard.writeText(content);
  
    // setCopied(true);
    // setTimeout(() => setCopied(false), 2000);


    const shareLink = `http://localhost:3000/chat/${chatId}`;
    navigator.clipboard.writeText(shareLink);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
  
  // 1️⃣ Summarize the bot's message in 4-6 words
    // const summarizeResponse = async (botText: string): Promise<string | null> => {
    //   try {
    //     const summaryPrompt = `Summarize this into a short chat title:\n${botText}`;
    //     const response = await axios.post("http://localhost:5001/api/summarize", {
    //       prompt: summaryPrompt,
    //       model: "gpt-3.5-turbo",
    //     });
    //     return response.data?.response?.trim() ?? null;
    //   } catch (error) {
    //     console.error("❌ Error summarizing response:", error);
    //     return null;
    //   }
    // };
    
    const summarizeResponse = async (botText: string, userText: string): Promise<string | null> => {
      try {
        const response = await axios.post("http://localhost:5001/api/summarize", {
          messages: [
            { text: userText, sender: "user" },
            { text: botText, sender: "bot" }
          ]
        });
        return response.data?.summary?.trim() ?? null;
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

  const chatCount = parseInt(localStorage.getItem("chatCount") || "0", 10);
  const isSubscribed = localStorage.getItem("isSubscribed") === "true";

  // for testing pupose but make it around 10 or 20
  if (!isSubscribed && chatCount >= 5) {
    setModalPage("subscription-modal"); // Show the pricing popup
    return; // Block sending further messages
  }

  localStorage.setItem("chatCount", (chatCount + 1).toString());


  const userMessage: Message = { text: value, sender: "user" };
  setValue(""); // ✅ Clear input immediately after capturing the value

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

  const isNewChat = !chatHistory.find(chat => chat.id === currentChatId);
  if (isNewChat) {
    try {
      await axios.post("http://localhost:5001/api/save-chat-history", {
        userId,
        chatId: currentChatId,
        chatName: "New Chat",
        messages: [userMessage], // save only the first message
      });
      console.log("✅ Chat saved to DB on first message.");
    } catch (error) {
      console.error("❌ Failed to save chat on first message:", error);
    }
  }


  const aiPersonality = localStorage.getItem("aiPersonality") || "Friendly";
  const personalityPrompt = getPersonalityPrompt(aiPersonality);
  const prompt = `${personalityPrompt}\n\nUser: ${value}\nAI: If the user's question is not related to cybersecurity, respond with: "I specialize in cybersecurity topics! Please ask me something related to online safety, ethical hacking, or privacy." Otherwise, answer the question.`;

  try {
    setBotTyping(true);
    const res = await axios.post("http://localhost:5001/api/chat", {
      prompt,
      question: value,
      model,
      userId,
      chatId: currentChatId,
    });
    setBotTyping(false);

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
      //2
      // await axios.post("http://localhost:5001/api/save-chat-history", {
      //   userId,
      //   chatId: currentChatId,
      //   chatName: "User Chat",
      //   messages: [
      //     { text: value, sender: "user", timestamp: new Date() },
      //     { text: botMessage.text, sender: "bot", timestamp: new Date() },
      //   ],
      // });
      const saveRes = await axios.post("http://localhost:5001/api/save-chat-history", {
        userId,
        chatId: currentChatId,
        chatName: "New Chat",
        messages: [
          { text: value, sender: "user", timestamp: new Date() },
          { text: botMessage.text, sender: "bot", timestamp: new Date() },
        ],
      });
      
      const backendChatName = saveRes.data.chat_name;
      console.log("✅ Chat history saved successfully.");
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, chat_name: backendChatName }
            : chat
        )
      );
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Error saving chat history:", error.response?.data || error.message);
      } else {
        console.error("❌ Unexpected error:", error);
      }
    }

    const summary = await summarizeResponse(botMessage.text, value);
    if (!summary) {
      console.warn("⚠️ Skipping chat name update due to missing summary.");
      return;
    }
    console.log("🧠 Summary from summarizeResponse:", summary);
    

    
    //2
    // setChatHistory((prev) =>
    //   prev.map((chat) =>
    //     chat.id === currentChatId
    //       ? { ...chat, chat_name: summary || "New Chat" }
    //       : chat
    //   )
    // );
    
    

    try {
      await axios.post("http://localhost:5001/api/update-chat-name", {
        userId,
        chatId: currentChatId,
        newName: summary, // at the update chat name chat history name should be summarized name
      });
      console.log("✅ Chat name updated successfully.");


      await fetchChatHistory();
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



// const handleSubmit = async () => {
//   if (!value.trim()) return;

//   const userId = localStorage.getItem("userId");
//   if (!userId) {
//     console.error("❌ Error: userId is missing!");
//     setMessages((prev) => [
//       ...prev,
//       { text: "⚠️ Error: User not authenticated.", sender: "bot" },
//     ]);
//     return;
//   }

//   const chatCount = parseInt(localStorage.getItem("chatCount") || "0", 10);
//   const isSubscribed = localStorage.getItem("isSubscribed") === "true";

//   if (!isSubscribed && chatCount >= 12) {
//     setModalPage("subscription-modal");
//     return;
//   }

//   localStorage.setItem("chatCount", (chatCount + 1).toString());

//   const userMessage: Message = { text: value, sender: "user" };
//   setValue("");

//   let currentChatId = activeChatId;

//   // 🔥 Fix: Find an existing blank "New Chat" if exists
//   if (!currentChatId) {
//     const existingNewChat = chatHistory.find(chat =>
//       chat.chat_name === "New Chat" && chat.messages.length === 0
//     );

//     if (existingNewChat) {
//       console.log("♻️ Using existing blank 'New Chat' with ID:", existingNewChat.id);
//       currentChatId = existingNewChat.id;
//       setActiveChatId(existingNewChat.id);
//       setMessages([userMessage]);
//       localStorage.setItem("activeChatId", existingNewChat.id.toString());
//     } else {
//       console.log("🆕 Creating a brand new chat");
//       currentChatId = `chat_${userId}_${Date.now()}`;
//       const newChat: ChatSession = {
//         id: currentChatId,
//         chat_name: "New Chat",
//         messages: [userMessage],
//       };
//       setChatHistory((prev) => [...prev, newChat]);
//       setActiveChatId(currentChatId);
//       setMessages([userMessage]);
//       localStorage.setItem("activeChatId", currentChatId.toString());
//     }
//   } else {
//     setMessages((prev) => [...prev, userMessage]);
//     setChatHistory((prev) =>
//       prev.map((chat) =>
//         chat.id === currentChatId
//           ? { ...chat, messages: [...chat.messages, userMessage] }
//           : chat
//       )
//     );
//   }

//   const isNewChat = !chatHistory.find(chat => chat.id === currentChatId);
//   if (isNewChat) {
//     try {
//       await axios.post("http://localhost:5001/api/save-chat-history", {
//         userId,
//         chatId: currentChatId,
//         chatName: "New Chat",
//         messages: [userMessage], // save only the first message
//       });
//       console.log("✅ Chat saved to DB on first message.");
//     } catch (error) {
//       console.error("❌ Failed to save chat on first message:", error);
//     }
//   }


//   const aiPersonality = localStorage.getItem("aiPersonality") || "Friendly";
//   const personalityPrompt = getPersonalityPrompt(aiPersonality);
//   const prompt = `${personalityPrompt}\n\nUser: ${value}\nAI: If the user's question is not related to cybersecurity, respond with: "I specialize in cybersecurity topics! Please ask me something related to online safety, ethical hacking, or privacy." Otherwise, answer the question.`;

//   try {
//     setBotTyping(true);
//     const res = await axios.post("http://localhost:5001/api/chat", {
//       prompt,
//       question: value,
//       model,
//       userId,
//       chatId: currentChatId,
//     });
//     setBotTyping(false);

//     const botMessage: Message = {
//       text: res.data?.response || "⚠️ Error: No response received",
//       sender: "bot",
//     };

//     setMessages((prev) => [...prev, botMessage]);
//     setChatHistory((prev) =>
//       prev.map((chat) =>
//         chat.id === currentChatId
//           ? { ...chat, messages: [...chat.messages, botMessage] }
//           : chat
//       )
//     );

//     try {
//       //2
//       // await axios.post("http://localhost:5001/api/save-chat-history", {
//       //   userId,
//       //   chatId: currentChatId,
//       //   chatName: "User Chat",
//       //   messages: [
//       //     { text: value, sender: "user", timestamp: new Date() },
//       //     { text: botMessage.text, sender: "bot", timestamp: new Date() },
//       //   ],
//       // });
//       const saveRes = await axios.post("http://localhost:5001/api/save-chat-history", {
//         userId,
//         chatId: currentChatId,
//         chatName: "New Chat",
//         messages: [
//           { text: value, sender: "user", timestamp: new Date() },
//           { text: botMessage.text, sender: "bot", timestamp: new Date() },
//         ],
//       });
      
//       const backendChatName = saveRes.data.chat_name;
//       console.log("✅ Chat history saved successfully.");
//       setChatHistory((prev) =>
//         prev.map((chat) =>
//           chat.id === currentChatId
//             ? { ...chat, chat_name: backendChatName }
//             : chat
//         )
//       );
      
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error("❌ Error saving chat history:", error.response?.data || error.message);
//       } else {
//         console.error("❌ Unexpected error:", error);
//       }
//     }

//     const summary = await summarizeResponse(botMessage.text, value);
//     if (!summary) {
//       console.warn("⚠️ Skipping chat name update due to missing summary.");
//       return;
//     }
//     console.log("🧠 Summary from summarizeResponse:", summary);
    

    
//     //2
//     // setChatHistory((prev) =>
//     //   prev.map((chat) =>
//     //     chat.id === currentChatId
//     //       ? { ...chat, chat_name: summary || "New Chat" }
//     //       : chat
//     //   )
//     // );
    
    

//     try {
//       await axios.post("http://localhost:5001/api/update-chat-name", {
//         userId,
//         chatId: currentChatId,
//         newName: summary, // at the update chat name chat history name should be summarized name
//       });
//       console.log("✅ Chat name updated successfully.");


//       await fetchChatHistory();
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error("❌ Error updating chat name:", error.response?.data || error.message);
//       } else {
//         console.error("❌ Unexpected error:", error);
//       }
//     }

//   } catch (error) {
//     let message = "⚠️ Error: Could not get a response.";
//     if (axios.isAxiosError(error)) {
//       console.error("❌ Axios error:", error.response?.data || error.message);
//       message = `⚠️ Axios Error: ${error.response?.data?.message || error.message}`;
//     } else {
//       console.error("❌ Unexpected error:", error);
//     }
  
//     const errorMessage: Message = {
//       text: message,
//       sender: "bot",
//     };
  
//     setMessages((prev) => [...prev, errorMessage]);
//     setChatHistory((prev) =>
//       prev.map((chat) =>
//         chat.id === currentChatId
//           ? { ...chat, messages: [...chat.messages, errorMessage] }
//           : chat
//       )
//     );
//   }  

//   setValue(""); // ✅ Clear input
// };











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
  
  
  useEffect(() => {
    // const storedUserId = localStorage.getItem("userId");
    localStorage.getItem("userId")
    const storedActiveChatId = localStorage.getItem("activeChatId");
  
    if (!localStorage.getItem("userId")) {
      console.warn("⚠️ No stored userId found.");
      return;
    }
  
    console.log(`🔍 Fetching chat history for userId: ${localStorage.getItem("userId")}`);
  
    axios
      .get(`http://localhost:5001/api/chat-history/${localStorage.getItem("userId")}`)
      .then((res) => {
        if (!res.data.success || !Array.isArray(res.data.data)) {
          console.error("❌ Invalid chat history response:", res.data);
          return;
        }
  
        // const chatSessions: ChatSession[] = res.data.data
        //   // .filter((chat: ChatData) => chat.chat_id || chat.id)
        //   .filter((chat: ChatData) => (chat.chat_id || chat.id) && Array.isArray(chat.messages))
        //   .map((chat: ChatData, index: number) => ({
        //     id: chat.chat_id || chat.id,
        //     chat_name: chat.chat_name?.trim() || `Chat ${index + 1}`,
        //     messages: Array.isArray(chat.messages) ? chat.messages : [],
        //   }));
        //   console.log("🧠 Processed chat sessions:", chatSessions);
        //2
        // setChatHistory(chatSessions);

        const chatSessions: ChatSession[] = res.data.data
          // .filter((chat: ChatData) => chat.chat_id || chat.id)
          .filter((chat: ChatData) => (chat.chat_id || chat.id) && Array.isArray(chat.messages))
          .map((chat: ChatData, index: number) => ({
            id: chat.chat_id || chat.id || `temp_${index}`, // fallback ID
            chat_name: chat.chat_name?.trim() || `Chat ${index + 1}`,
            messages: chat.messages || [],
          }));
          console.log("🧠 Processed chat sessions:", chatSessions);
        //2
        const cleanedChats = chatSessions.filter(chat => 
          !(chat.chat_name === "New Chat" && chat.messages.length === 0)
        );
        // setChatHistory(chatSessions.reverse());
        setChatHistory(cleanedChats.reverse());

        if (
          activeChatId &&
          !cleanedChats.find(chat => chat.id === activeChatId)
        ) {
          setActiveChatId(null);
          setMessages([]);
          localStorage.removeItem("activeChatId");
        }        

  
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
    // Clear auth info
    localStorage.removeItem("userId"); // ✅ Remove user login info
    localStorage.removeItem("token"); // ✅ Must clear this!

    // Clear chat session info
    localStorage.removeItem("activeChatId");
    localStorage.removeItem("chatCount");
    localStorage.removeItem("archivedChats");
    
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

  // const handleResetChats = async () => {
  //   const userId = localStorage.getItem("userId");
  //   if (!userId) {
  //     alert("No user ID found.");
  //     return;
  //   }
  
  //   try {
  //     // Call your backend to delete all chats for this user
  //     const res = await axios.delete(`http://localhost:5001/api/delete-all-chats/${userId}`);
  //     console.log("✅ Backend chat reset response:", res.data);
  //     //localStorage.clear(); // clears everything
  //     // Clear frontend state
  //     localStorage.removeItem("activeChatId");
  //     setChatHistory([]);
  //     setActiveChatId(null);
  //     setMessages([]);
  //     setMenuOpen(null); // ✅ This fixes the dropdown issue after reset
  //   } catch (err) {
  //     console.error("❌ Failed to delete chat history from DB:", err);
  //     alert("Failed to reset chats from backend.");
  //   }
  // };


  // const filteredChats = chatHistory.filter((chat) =>
  //   chat.chat_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   chat.messages.some((msg) =>
  //     msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  //   )
  // );
  
  const filteredChats = chatHistory
  .filter(chat => !archivedChats.includes(String(chat.id))) // ✅ hide archived ones
  .filter(chat =>
    chat.chat_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.messages.some(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const archiveChat = (chatId: string) => {
    setArchivedChats(prev => 
      prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
    );
  };
  
  useEffect(() => {
    localStorage.setItem("archivedChats", JSON.stringify(archivedChats));
  }, [archivedChats]);
  
  useEffect(() => {
    const stored = localStorage.getItem("archivedChats");
    if (stored) setArchivedChats(JSON.parse(stored));
  }, []);
  
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const res = await axios.get("http://localhost:5001/api/subscription-status", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        localStorage.setItem("isSubscribed", res.data.isSubscribed.toString());
      } catch (err) {
        console.error("❌ Failed to fetch subscription status", err);
      }
    };
  
    fetchSubscriptionStatus();
  }, []);
  


  return (
    // <div className="chat-container">
    <div className={`chat-container ${sidebarVisible ? "" : "hide-sidebar"}`}>

      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
         {/*  <input
            type="text"
            // id="search-input"
            // name="searchInput"
            placeholder="Search Your Chat History..."
            className="search-input"
          />*/}
          {sidebarVisible && (
            <button
              aria-label="Toggle Sidebar"
              className={`toggle-sidebar-btn ${sidebarVisible ? "rotated" : ""}`}
              onClick={() => setSidebarVisible(false)}
              title="Hide Sidebar"
            >
              <img className="toggle-icon-img" src="./src/assets/icons/toggle-icon.svg" alt="Toggle Sidebar" />
            </button>
          )}
          <input
            type="text"
            placeholder="Search Your Chat History..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button className="new-chat-btn" onClick={startNewChat}>
          <img src="../public/assets/chat-plus.svg" alt="New Chat" />
          </button>


        </div>


        <div className="chat-history">
          {filteredChats.map((chat, index) => {
            console.log("🧪 Checking chat.id:", String(chat.id), "menuOpen:", menuOpen);
            const safeId = chat.id || `fallback-${index}`;
            return (
              // <div
              //   key={chat.id}
              //   // className={`chat-history-item ${menuOpen === chat.id ? "menu-open" : ""}`}
              //   className={`chat-history-item ${menuOpen === safeId ? "menu-open" : ""}`}
              // >
              <div
                key={safeId}
                // className={`chat-history-item ${menuOpen === chat.id ? "menu-open" : ""}`}
                className={`chat-history-item ${menuOpen === safeId ? "menu-open" : ""}`}
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
                  {/* <span>{chat.chat_name || `Chat ${chat.id}`}</span> */}
                  <span title={chat.chat_name}>
                    {chat.chat_name
                      ? chat.chat_name.split(" ").slice(0, 4).join(" ") + (chat.chat_name.split(" ").length > 4 ? "..." : "")
                      : chat.messages?.[0]?.text.split(" ").slice(0, 4).join(" ") + "..." || `Chat ${chat.id}`}
                  </span>

                </button>
                



                <button 
                  className="menu-button"
                  onClick={(e) => {
                    e.stopPropagation(); // ⛔ Prevents event from reaching document
                    toggleMenu(String(chat.id));
                  }}
                >
                ⋮</button>


                {String(menuOpen) === String(chat.id) && (
                  <div 
                  className="chat-menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("✅ Inside chat-menu for:", chat.id);
                  }}
                  
                  >
                    <ul>
                      <li onClick={() => shareChat(String(chat.id))}>Share</li>
                      <li onClick={() => renameChat(String(chat.id))}>Rename</li>
                      <li onClick={() => archiveChat(String(chat.id))}>Archive</li>
                      <li onClick={() => deleteChat(localStorage.getItem("userId") || "", String(chat.id))} className="delete">Delete</li>
                    </ul>
                    {copied && <div className="copy-popup">🔗 Link copied!</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* <button
          className="reset-chat-btn"
          onClick={() => {
            const confirmReset = window.confirm("Are you sure you want to delete all chats?");
            if (confirmReset) {
              handleResetChats();
            }
          }}
        >
          🧼 Reset Chats
        </button> */}

        
        </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="sidebar-title2">
        <div className="title-area">
          {!sidebarVisible && (
            <button
              className={`toggle-sidebar-btn ${!sidebarVisible ? "rotated" : ""}`}
              onClick={() => setSidebarVisible(true)}
              title="Show Sidebar"
            >
              <img className="toggle-icon-img" src="./src/assets/icons/toggle-icon.svg" alt="Toggle Sidebar" />
            </button>
          )}
          <div className="title">CYBERBOT</div>
        </div>



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
              <option value="securebert">SecureBERT</option> {/* 👈 Add this */}
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
                    {/* <li onClick={() => openModal("dashboard")}>Dashboard</li>
                    <li onClick={() => openModal("account")}>Account Settings</li>
                    <li onClick={() => openModal("subscription")}>Subscription</li>
                    <li onClick={() => openModal("notifications")}>Notifications</li>
                    <li onClick={() => openModal("ai-preferences")}>AI Preferences</li>
                    <li onClick={() => openModal("privacy")}>Privacy</li>
                    <li onClick={() => openModal("help")}>Help</li>
                    <li onClick={handleLogout} className="logout-button">
                      Log Out
                    </li> */}
                    <li onClick={() => setModalPage("settings")}>Settings</li>
                    <li onClick={() => setModalPage("privacy")}>Privacy</li>
                    <li onClick={() => setModalPage("help")}>Help</li>
                    <li onClick={handleLogout} className="logout-button">Log Out</li>
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
        <div className="chat-messages-wrapper">
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
            {messages.map((msg: Message) => (
              <div key={`${msg.timestamp}-${msg.text}`} className={`message ${msg.sender}`}>
              {msg.sender === "bot" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
              </div>
            ))}
            {botTyping && (
              <div className="message bot typing-indicator">
                <em>CyberBot is typing...</em>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
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
      {modalPage === "settings" && (
        <SettingsModal
          onClose={closeModal}
          openModal={openModal}
        />
      )}


      {modalPage === "dashboard" && <DashboardPage onClose={() => setModalPage(null)} />}
      {modalPage === "account" && <AccountPage onClose={() => setModalPage(null)} />}
      {modalPage === "subscription" && <SubscriptionPage onClose={() => setModalPage(null)} />}
      {modalPage === "notifications" && <NotificationsPage onClose={() => setModalPage(null)} />}
      {modalPage === "ai-preferences" && <AIPreferencesPage onClose={() => setModalPage(null)} />}
      {modalPage === "privacy" && <PrivacyPage onClose={() => setModalPage(null)} />}
      {modalPage === "help" && <HelpPage onClose={() => setModalPage(null)} />}
      {modalPage === "subscription-modal" && <SubscriptionModal onClose={() => setModalPage(null)} />}

    </div>
  );
}

export default App;