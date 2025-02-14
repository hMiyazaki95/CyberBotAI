// // App.tsx

// // import useState so that we can update the response we get from the API
// import { useState } from "react";
// // import axios so we can easily send the user's input to our server
// import axios from "axios";
// import "./App.css";

// function App() {
// // We store and update the responses we get from the API with this state
// // I've added a default value to the 'response' state that we should see 
// // when the page initially loads
//   const [response, setResponse] = useState<string>("Hi there! How can I assist you?");
// // We also store the input we get from the user in the 'value' state and
// // update it everytime the user types into the input field we have added below
//   const [value, setValue] = useState<string>("");

// // We use this function in the newly added 'input' in the return statement.
// // Each time the user types into the input, this function ensures that the
// // 'value' state is updated
// // We also add a type to the event that we pass in
//   const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
//     setValue(e.target.value);

// // This function runs when the user presses the button we have added below
// // This function takes the contents of 'value' (the input from the user) 
// // and then sends this value to our server, which then sends a new request
// // to the API
// // The function then waits for the new response and updates the 'response'
// // value which we then display on the page
// const handleSubmit = async () => {
//     const response = await axios.post("http://localhost:3005/chatbot", {
//       question: value,
//     });
//     setResponse(response.data);
//   };

// // In our return statement, we add an input field so that the user can ask 
// // questions to the API
// // We also add a button so that the user can submit their question which then
// // updates the response from the API
// // We show the updated response on our page
// return (
//     <div className="container">
//       <div>
//         <input
//           type="text"
//           value={value}
//           onChange={onChange}
//           placeholder="Enter your question"
//         />
//       </div>
//       <div>
//         <button onClick={handleSubmit}>Click me for answers!</button>
//       </div>
//       <div>
//         <p>Chatbot: {response}</p>
//       </div>
//     </div>
//   );
// };

// export default App;



import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  //const [response, setResponse] = useState<string>("Hi there! How can I assist you?");
  const [value, setValue] = useState<string>("");
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);

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
      const res = await axios.post<{ text: string } | string>("http://localhost:3005/chatbot", {
        question: value,
      });
  
      // Extract bot response safely
      const botText = typeof res.data === "string" ? res.data : res.data.text;
  
      // Store bot's response
      const botMessage = { text: botText, sender: "bot" as const };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { text: "Error: Could not get a response.", sender: "bot" as const }]);
    }
  
    setValue(""); // Clear input after sending
  };
  
  
  
  

  return (
    <div className="chat-container">
      {/* === Sidebar (Fixed Size) === */}
      <div className="chat-sidebar">
        <div className="sidebar-title">Chat History</div>
        <div className="chat-history">
          <div className="history-item">Conversation 1</div>
          <div className="history-item">Conversation 2</div>
        </div>
      </div>

      {/* === Main Chat Area === */}
      <div className="chat-main">
        <div className="chat-header">Cybersecurity AI Bot</div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input type="text" value={value} onChange={onChange} placeholder="Enter your question..." />
          <button onClick={handleSubmit}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
