// import mongoose from "mongoose";

// const chatHistorySchema = new mongoose.Schema({
//   user_id: Number,
//   chat_id: String,
//   chat_name: String,
//   messages: [
//     {
//       timestamp: { type: Date, default: Date.now },
//       text: String,
//       sender: { type: String, enum: ["user", "bot"] },
//     },
//   ],
// });

// // ⬇️ This should match your collection name in MongoDB
// export default mongoose.model("ChatHistory", chatHistorySchema, "chathistories"); 

import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  chat_id: { type: String, required: true, unique: true },
  chat_name: { type: String, default: "New Chat" },
  messages: [
    {
      text: String,
      sender: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const ChatHistory = mongoose.model("ChatHistory", ChatSchema);

export default ChatHistory;  // ✅ Fix: Proper ES Module Export

