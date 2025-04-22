// // import express from "express";
// // import cors from "cors";
// // import dotenv from "dotenv";
// // import bodyParser from "body-parser";
// // import pkg from "pg";
// // import bcrypt from "bcryptjs";
// // import jwt from "jsonwebtoken";
// // import { OpenAI } from "openai"; // ✅ Added OpenAI for Chatbot
// // import mongoose from "mongoose";
// // import ChatHistory from "./src/models/ChatHistory.js"; // Import the model
// // import crypto from "crypto";
// // import { pipeline } from "@xenova/transformers"; // 🧠 Use this instead of huggingface's Python API
// // import LanguageToolApi from 'languagetool-api';


// // dotenv.config({ path: "./.env" });
// // console.log("🔍 MONGO_URI:", process.env.MONGO_URI); // Debugging

// // // ✅ Initialize Express app FIRST
// // const app = express();
// // const port = process.env.PORT || 5001;
// // const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // ⚠️ Use a strong secret in .env



// // // ✅ MongoDB Connection (AFTER loading env variables)
// // const mongoURI = process.env.MONGO_URI;
// // if (!mongoURI) {
// //   console.error("❌ MONGO_URI is missing! Check your .env file.");
// //   process.exit(1);
// // }

// // mongoose
// //   .connect(mongoURI)
// //   .then(async () => {
// //     console.log(`[${new Date().toISOString()}] ✅ Connected to MongoDB`);
    
// //     // 🔍 Debugging: Try fetching 1 document
// //     try {
// //       const testChat = await ChatHistory.find().limit(5).exec();
// //       console.log(`[${new Date().toISOString()}] ✅ Found ChatHistory Data:`, testChat);
// //     } catch (error) {
// //       console.error(`[${new Date().toISOString()}] ❌ Query Error:`, error);
// //     }
// //   })
// //   .catch((err) => {
// //     console.error(`[${new Date().toISOString()}] ❌ MongoDB Connection Error:`, err);
// //     process.exit(1);
// //   });


// //   mongoose.connection.on("error", (err) => {
// //     console.error(`[${new Date().toISOString()}] ❌ MongoDB Connection Error:`, err);
// //   });
// //   mongoose.connection.once("open", () => {
// //     console.log(`[${new Date().toISOString()}] ✅ MongoDB Connected Successfully`);
// //   });
  
// // //✅ Test MongoDB Connection Route
// // app.get("/api/test-mongo", async (req, res) => {
// //   try {
// //     const page = parseInt(req.query.page) || 1;
// //     const limit = parseInt(req.query.limit) || 10;
// //     const skip = (page - 1) * limit;

// //     console.log(`[${new Date().toISOString()}] 🔍 Fetching ChatHistory... Page: ${page}, Limit: ${limit}`);

// //     const testChat = await ChatHistory.find().skip(skip).limit(limit).exec();

// //     console.log(`[${new Date().toISOString()}] ✅ Fetched ${testChat.length} records`);

// //     res.json({ success: true, data: testChat, page, limit });
// //   } catch (error) {
// //     console.error(`[${new Date().toISOString()}] ❌ MongoDB Test Error:`, error);
// //     res.status(500).json({ error: "MongoDB connection failed" });
// //   }
// // });

// // // ✅ PostgreSQL Connection (Ensure declared once)
// // const { Pool } = pkg;
// // const pool = new Pool({
// //   user: process.env.DB_USER,
// //   host: process.env.DB_HOST,
// //   database: process.env.DB_NAME,
// //   password: process.env.DB_PASSWORD,
// //   port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
// // });


// // // ✅ Update Content Security Policy (CSP) to allow Chatbot API
// // app.use((req, res, next) => {
// //   res.setHeader(
// //     "Content-Security-Policy",
// //     "default-src 'self'; " +
// //     "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
// //     "style-src 'self' 'unsafe-inline'; " +
// //     "img-src 'self' data:; " + // ✅ Allows base64 and inline images
// //     "connect-src 'self' http://localhost:5001 http://localhost:3000 ws://localhost:5001 wss://localhost:5001;"
// //   );
// //   next();
// // });


// // app.use(cors({
// //   origin: "http://localhost:3000", // ✅ Adjust for Vite frontend
// //   methods: "GET,POST,PUT,DELETE",
// //   allowedHeaders: "Content-Type, Authorization",
// //   credentials: true
// // }));
// // app.use(bodyParser.json());
// // app.use(express.json());

// // /* ─────────────────────────────────── */
// // /* ✅ User Authentication Endpoints    */
// // /* ─────────────────────────────────── */

// // // ✅ Registration Endpoint
// // app.post("/api/register", async (req, res) => {
// //   try {
// //     const { question, model, userId, chatId } = req.body;

// // if (!question || !model || !userId) {
// //   console.warn("❌ Missing parameters:", { question, model, userId });
// //   return res.status(400).json({ error: "Missing parameters" });
// // }

// //     // ✅ Check if user already exists
// //     const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

// //     if (userExists.rows.length > 0) {
// //       return res.status(409).json({ error: "User already exists" });
// //     }

// //     // ✅ Hash password before storing
// //     const hashedPassword = bcrypt.hashSync(password, 10);

// //     // ✅ Insert user into database
// //     await pool.query(
// //       "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
// //       [username, email, hashedPassword]
// //     );

// //     return res.status(201).json({ message: "User registered successfully" });

// //   } catch (error) {
// //     console.error("❌ Server Error:", error);
// //     return res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// // // ✅ Login Authentication Endpoint
// // app.post("/api/login", async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     console.log("🔍 Login Attempt:", email);

// //     const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

// //     if (user.rows.length === 0) {
// //       console.warn("❌ User not found:", email);
// //       return res.status(401).json({ error: "Invalid email or password" });
// //     }

// //     const storedUser = user.rows[0];
// //     console.log("✅ User Found:", storedUser.email);

// //     const isMatch = bcrypt.compareSync(password, storedUser.password);
// //     if (!isMatch) {
// //       console.warn("❌ Incorrect password for:", email);
// //       return res.status(401).json({ error: "Invalid email or password" });
// //     }

// //     const token = jwt.sign(
// //       {
// //         userId: storedUser.id, // ✅ Includes userId in token
// //         email: storedUser.email,
// //         exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2-hour expiry
// //       },
// //       JWT_SECRET
// //     );

// //     console.log("✅ Login Successful for:", email);

// //     // ✅ Ensure `userId` is returned
// //     return res.json({ 
// //       message: "Login successful", 
// //       token, 
// //       userId: storedUser.id  
// //     });

// //   } catch (error) {
// //     console.error("❌ Server Error:", error);
// //     return res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });


// // // ✅ Middleware to Check JWT Expiration// ✅ Middleware to Check JWT Expiration & Protect Routes
// // const checkTokenExpiration = (req, res, next) => {
// //   const token = req.header("Authorization")?.split(" ")[1];

// //   if (!token) return res.status(403).json({ error: "Access Denied" });

// //   try {
// //     const decoded = jwt.verify(token, JWT_SECRET);
// //     if (decoded.exp * 1000 < Date.now()) {
// //       console.warn("❌ Token Expired for:", decoded.email);
// //       return res.status(401).json({ error: "Session expired. Please log in again." });
// //     }

// //     req.user = decoded;
// //     next();
// //   } catch (error) {
// //     console.error("❌ Invalid Token:", error);
// //     return res.status(401).json({ error: "Invalid Token" });
// //   }
// // };

// // // ✅ Protected Route Example
// // app.get("/api/protected-route", checkTokenExpiration, (req, res) => {
// //   res.json({ message: "This is a protected route", user: req.user });
// // });



// // // ✅ Middleware to Protect Routes (Ensure declared once)
// // const authenticateToken = (req, res, next) => {
// //   const token = req.header("Authorization")?.split(" ")[1];

// //   if (!token) {
// //     console.warn("⚠️ Access denied: No token provided.");
// //     return res.status(403).json({ error: "Access Denied" });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, JWT_SECRET);

// //     if (decoded.exp * 1000 < Date.now()) {
// //       console.warn("❌ Token expired for:", decoded.email);
// //       return res.status(401).json({ error: "Session expired. Please log in again." });
// //     }

// //     req.user = decoded;
// //     next();
// //   } catch (error) {
// //     console.error("❌ Invalid Token:", error);
// //     return res.status(401).json({ error: "Invalid Token" });
// //   }
// // };

// // // ✅ Add this API endpoint
// // app.get("/api/protected-route", authenticateToken, (req, res) => {
// //   res.json({ message: "User is authenticated", user: req.user });
// // });


// // /* ─────────────────────────────────── */
// // /* ✅ Chatbot Integration - OpenAI GPT */
// // /* ─────────────────────────────────── */

// // // ✅ Load OpenAI API Key (Ensure declared once)
// // const apiKey = process.env.OPENAI_API_KEY;
// // if (!apiKey) {
// //   console.error("❌ OPENAI_API_KEY is missing! Set it in .env");
// //   process.exit(1);
// // }

// // // ✅ Initialize OpenAI (Ensure declared once)
// // const openai = new OpenAI({ apiKey });

// // // ✅ Chatbot API Route
// // app.post("/api/chat", async (req, res) => {
// //   const { question, prompt, model, userId, chatId } = req.body;

// //   if (!question || !model || !userId) {
// //     console.warn("❌ Missing parameters:", { question, model, userId });
// //     return res.status(400).json({ error: "Missing parameters" });
// //   }

// //   if (model === "securebert") {
// //     try {
// //       const textWithMask = question.includes("[MASK]") ? question : question + " [MASK]";
// //       const hfResult = await secureBertPipeline(textWithMask);
  
// //       const responseText = hfResult?.[0]?.sequence || "No response generated by SecureBERT";
// //       return res.json({ response: responseText });
// //     } catch (err) {
// //       console.error("❌ Hugging Face Error:", err);
// //       return res.status(500).json({ error: "Hugging Face model failed", details: err.message });
// //     }
// //   }
  

// //   try {
// //     console.log("📨 Sending request to OpenAI:", { model, question });

// //     const messages = prompt
// //       ? [
// //           { role: "system", content: prompt }, // 🧠 custom personality prompt
// //           { role: "user", content: question },
// //         ]
// //       : [
// //           { role: "system", content: cyberBotBehavior }, // fallback to default
// //           { role: "user", content: question },
// //         ];

// //     res.setHeader("Content-Type", "text/event-stream");
// //     res.setHeader("Cache-Control", "no-cache");
// //     res.setHeader("Connection", "keep-alive");
        
// //     const completion = await openai.chat.completions.create({
// //         model,
// //         stream: true,
// //         temperature: 0.7,
// //         max_tokens: 500,
// //         messages,
// //     });
        
// //     let responseText = "";
// //     for await (const chunk of completion) {
// //       const token = chunk.choices?.[0]?.delta?.content || "";
// //       responseText += token;
// //       res.write(`data: ${token}\n\n`);
// //     }
// //     res.write("data: [DONE]\n\n");
// //     res.end();
        

// //     // const responseText = openaiResponse.choices[0]?.message?.content || "No response generated";
// //     console.log("✅ OpenAI Response:", responseText);

// //     const chatEntry = {
// //       user_id: userId,
// //       chat_id: chatId,
// //       chat_name: "User Chat",
// //       messages: [
// //         { text: question, sender: "user", timestamp: new Date() },
// //         { text: responseText, sender: "bot", timestamp: new Date() },
// //       ],
// //     };

// //     // await ChatHistory.findOneAndUpdate(
// //     //   { chat_id: chatId, user_id: userId},
// //     //   { $push: { messages: { $each: chatEntry.messages } } },
// //     //   { upsert: true, new: true }
// //     // );

// //     // res.json({ response: responseText });
// //   } catch (error) {
// //     console.error("❌ Error fetching response:", error?.response?.data || error.message || error);
// //     res.status(500).json({ error: "Failed to fetch AI response", details: error.message });
// //   }
// // });



// // //working
// // app.get("/api/chat-history/:userId", async (req, res) => {
// //   try {
// //     const chatHistory = await ChatHistory.find({ user_id: req.params.userId });

// //     if (!chatHistory.length) {
// //       return res.json({ success: true, data: [] });
// //     }

// //     const formattedChats = chatHistory.map((chat) => ({
// //       id: chat.chat_id,
// //       chat_name:
// //         !chat.messages || chat.messages.length === 0
// //           ? "New Chat"
// //           : chat.chat_name || `Chat ${chat.chat_id}`,
// //       messages: chat.messages.map((m) => ({
// //         text: (() => {
// //           try {
// //             return decrypt(m.text);
// //           } catch (e) {
// //             console.warn("⚠️ Failed to decrypt message:", e.message);
// //             return "[Decryption Error]";
// //           }
// //         })(),
// //         sender: m.sender,
// //         timestamp: m.timestamp || new Date(),
// //       })),
// //     }));
    

// //     res.json({ success: true, data: formattedChats });
// //   } catch (error) {
// //     console.error("❌ Error fetching chat history:", error);
// //     res.status(500).json({ error: "Failed to fetch chat history" });
// //   }
// // });




// // app.delete("/api/delete-chat/:userId/:chatId", async (req, res) => {
// //   const { chatId } = req.params;
// //   console.log(`🧹 Attempting to delete chat with chatId=${chatId}`);

// //   try {
// //     const result = await ChatHistory.deleteOne({ chat_id: chatId });

// //     if (result.deletedCount === 0) {
// //       console.warn("❌ No matching chat found to delete");
// //       return res.status(404).json({ success: false, message: "Chat not found" });
// //     }

// //     console.log("✅ Chat deleted successfully");
// //     res.json({ success: true, message: "Chat deleted successfully" });
// //   } catch (error) {
// //     console.error("❌ Error deleting chat:", error);
// //     res.status(500).json({ success: false, message: "Server error" });
// //   }
// // });


// // // app.post("/api/save-chat-history", async (req, res) => {
// // //   const { userId, chatId, messages } = req.body;

// // //   if (!userId || !chatId || !messages || !Array.isArray(messages)) {
// // //     return res.status(400).json({ error: "Invalid parameters" });
// // //   }

// // //   try {
// // //     let chatName = `Chat ${chatId}`;

// // //     const firstUserMessage = messages.find((m) => m.sender === "user")?.text?.trim();

// // //     if (firstUserMessage) {
// // //       try {
// // //         const openaiResponse = await openai.chat.completions.create({
// // //           model: "gpt-4",
// // //           max_tokens: 20,
// // //           temperature: 0.5,
// // //           messages: [
// // //             {
// // //               role: "system",
// // //               content: "Generate a short and unique title for this cybersecurity-related conversation. Avoid generic words like 'Help' or 'Chat'.",
// // //             },
// // //             { role: "user", content: firstUserMessage },
// // //           ],
// // //         });

// // //         const aiTitle = openaiResponse.choices?.[0]?.message?.content?.trim();
// // //         if (aiTitle) {
// // //           chatName = aiTitle;
// // //         }
// // //       } catch (err) {
// // //         console.warn("⚠️ Failed to generate title. Using fallback.");
// // //       }
// // //     }

// // //     console.log(`💬 Saving chat ${chatId} for user ${userId} with name "${chatName}"`);

// // //     const updatedChat = await ChatHistory.findOneAndUpdate(
// // //       { chat_id: chatId, user_id: userId },
// // //       {
// // //         $setOnInsert: {
// // //           user_id: userId,
// // //           chat_id: chatId,
// // //           chat_name: chatName,
// // //         },
// // //         $push: { messages: { $each: messages } },
// // //       },
// // //       { upsert: true, new: true }
// // //     );

// // //     // If chat already existed, update the name separately
// // //     if (updatedChat && updatedChat.chat_name !== chatName) {
// // //       await ChatHistory.updateOne(
// // //         { chat_id: chatId, user_id: userId },
// // //         { $set: { chat_name: chatName } }
// // //       );
// // //     }

// // //     res.json({ success: true, chat_name: chatName });
// // //   } catch (error) {
// // //     console.error("❌ Save error:", error);
// // //     res.status(500).json({ error: "Failed to save chat history" });
// // //   }
// // // });

// // app.post("/api/save-chat-history", async (req, res) => {
// //   const { userId, chatId, messages } = req.body;

// //   if (!userId || !chatId || !messages || !Array.isArray(messages)) {
// //     return res.status(400).json({ error: "Invalid parameters" });
// //   }

// //   try {
// //     let chatName = `Chat ${chatId}`;

// //     // Get the first user message (decrypted)
// //     const firstUserMessage = messages.find((m) => m.sender === "user")?.text?.trim();

// //     if (firstUserMessage) {
// //       try {
// //         const openaiResponse = await openai.chat.completions.create({
// //           model: "gpt-4",
// //           max_tokens: 20,
// //           temperature: 0.5,
// //           messages: [
// //             {
// //               role: "system",
// //               content:
// //                 "Generate a short and unique title for this cybersecurity-related conversation. Avoid generic words like 'Help' or 'Chat'.",
// //             },
// //             { role: "user", content: firstUserMessage },
// //           ],
// //         });

// //         const aiTitle = openaiResponse.choices?.[0]?.message?.content?.trim();
// //         if (aiTitle) {
// //           chatName = aiTitle;
// //         }
// //       } catch (err) {
// //         console.warn("⚠️ Failed to generate title. Using fallback.");
// //       }
// //     }

// //     console.log(`💬 Saving chat ${chatId} for user ${userId} with name "${chatName}"`);

// //     // ✅ Encrypt messages before saving
// //     const encryptedMessages = messages.map((m) => ({
// //       ...m,
// //       text: encrypt(m.text),
// //     }));

// //     const updatedChat = await ChatHistory.findOneAndUpdate(
// //       { chat_id: chatId, user_id: userId },
// //       {
// //         $setOnInsert: {
// //           user_id: userId,
// //           chat_id: chatId,
// //           chat_name: chatName,
// //         },
// //         $push: {
// //           messages: {
// //             $each: encryptedMessages,
// //           },
// //         },
// //       },
// //       { upsert: true, new: true }
// //     );

// //     // Update name separately if needed
// //     if (updatedChat && updatedChat.chat_name !== chatName) {
// //       await ChatHistory.updateOne(
// //         { chat_id: chatId, user_id: userId },
// //         { $set: { chat_name: chatName } }
// //       );
// //     }

// //     res.json({ success: true, chat_name: chatName });
// //   } catch (error) {
// //     console.error("❌ Save error:", error);
// //     res.status(500).json({ error: "Failed to save chat history" });
// //   }
// // });


// // app.post("/api/update-chat-name", async (req, res) => {
// //   const { userId, chatId, newName } = req.body;

// //   if (!userId || !chatId || !newName) {
// //     return res.status(400).json({ error: "Missing fields" });
// //   }

// //   try {
// //     // const chat = await ChatHistory.findOneAndUpdate(
// //     //   { userId, chat_id: chatId },
// //     //   { chat_name: newName },
// //     //   { new: true }
// //     // );  -> changed to

// //     const chat = await ChatHistory.findOneAndUpdate(
// //       { user_id: userId, chat_id: chatId },
// //       { $set: { chat_name: newName } }, 
// //       { new: true }
// //     );
    

// //     if (!chat) {
// //       return res.status(404).json({ error: "Chat not found" });
// //     }

// //     res.json({ success: true, data: chat });
// //   } catch (err) {
// //     console.error("❌ Error updating chat name:", err);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // });



// // app.post("/api/summarize", async (req, res) => {
// //   const { messages } = req.body;


// //   if (!messages || !Array.isArray(messages) || messages.length === 0) {
// //     return res.status(400).json({ error: "No messages to summarize" });
// //   }

// //   const userMessages = messages
// //     .filter((m) => m.sender === "user")
// //     .map((m) => m.text)
// //     .join("\n");

// //   try {
// //     const openaiResponse = await openai.chat.completions.create({
// //       model: "gpt-4",
// //       max_tokens: 30,
// //       temperature: 0.3,
// //       messages: [
// //         {
// //           role: "system",
// //           content: "Summarize this conversation into a short and meaningful title. Avoid generic titles like 'Chat'.",
// //         },
// //         {
// //           role: "user",
// //           content: userMessages,
// //         },
// //       ],
// //     });

// //     const summary = openaiResponse.choices?.[0]?.message?.content?.trim();

// //     if (!summary) {
// //       return res.status(500).json({ error: "Failed to generate summary" });
// //     }

// //     return res.json({ summary });
// //   } catch (error) {
// //     console.error("❌ Error summarizing chat:", error?.response?.data || error.message);
// //     res.status(500).json({ error: "Error generating summary", details: error.message });
// //   }
// // });

// // app.get("/api/test-delete-chat", (req, res) => {
// //   res.send("✅ Delete route is reachable!");
// // });



// // /**
// //  * ✅ Encryption and Decryption
// //  */
// // const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "12345678901234567890123456789012"; // 32-byte key for AES-256
// // const IV_LENGTH = 16;

// // export function encrypt(text) {
// //   const iv = crypto.randomBytes(IV_LENGTH);
// //   const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
// //   let encrypted = cipher.update(text, "utf8", "hex");
// //   encrypted += cipher.final("hex");
// //   return iv.toString("hex") + ":" + encrypted;
// // }

// // // export function decrypt(text) {
// // //   const [ivHex, encryptedText] = text.split(":");
// // //   const iv = Buffer.from(ivHex, "hex");
// // //   const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
// // //   let decrypted = decipher.update(encryptedText, "hex", "utf8");
// // //   decrypted += decipher.final("utf8");
// // //   return decrypted;
// // // }

// // export function decrypt(text) {
// //   try {
// //     if (!text.includes(":")) {
// //       throw new Error("Malformed encrypted text (missing IV delimiter)");
// //     }

// //     const [ivHex, encryptedText] = text.split(":");
// //     if (ivHex.length !== 32) {
// //       throw new Error("Invalid IV length");
// //     }

// //     const iv = Buffer.from(ivHex, "hex");
// //     const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);

// //     let decrypted = decipher.update(encryptedText, "hex", "utf8");
// //     decrypted += decipher.final("utf8");

// //     return decrypted;
// //   } catch (err) {
// //     console.warn("⚠️ Decryption failed:", err.message);
// //     return "[Decryption Error]";
// //   }
// // }


// // let secureBertPipeline;

// // (async () => {
// //   secureBertPipeline = await pipeline("fill-mask", "Xenova/bert-base-uncased"); // temporary placeholder
// //   console.log("✅ Hugging Face SecureBERT pipeline loaded");
// // })();


// // app.post("/api/correct-text", async (req, res) => {
// //   const { text } = req.body;

// //   if (!text) {
// //     return res.status(400).json({ error: "Text is required" });
// //   }

// //   try {
// //     const corrected = await new Promise((resolve, reject) => {
// //       LanguageToolApi.check(
// //         {
// //           text,
// //           language: "en-US",
// //         },
// //         (err, result) => {
// //           if (err) {
// //             return reject(err);
// //           }

// //           if (!result || !result.matches) {
// //             return reject(new Error("Invalid response from LanguageTool API"));
// //           }

// //           let correctedText = text;
// //           for (const match of result.matches.reverse()) {
// //             if (match.replacements.length > 0) {
// //               const replacement = match.replacements[0].value;
// //               correctedText =
// //                 correctedText.slice(0, match.offset) +
// //                 replacement +
// //                 correctedText.slice(match.offset + match.length);
// //             }
// //           }

// //           resolve(correctedText);
// //         }
// //       );
// //     });

// //     res.json({ corrected });
// //   } catch (err) {
// //     console.error("❌ LanguageTool correction error:", err);
// //     res.status(500).json({ error: "Correction failed", details: err.message });
// //   }
// // });




// // /* ─────────────────────────────────── */
// // /* ✅ CyberBot Behavior (Personality)  */
// // /* ─────────────────────────────────── */

// // // CyberBot's Behavior and Identity
// // const cyberBotBehavior = `🚀 **Improved CyberBot Conversation Flow**

// // **CyberBot’s Initial Greeting:**  
// // 🔹 *Professional, welcoming, and reassuring.*

// // "Hello! I am CyberBot, your Cybersecurity Assistant. I specialize in Threat Detection, Incident Response, and Cybersecurity Education. How can I assist you today?"

// // If you’re experiencing a cybersecurity issue, I’m here to guide you step by step. Please select one of the following options to proceed:

// // 1. **Detect Cyber Threats** – Identify potential security risks.
// // 2. **Incident Response Guidance** – Get help recovering from an attack.
// // 3. **Cybersecurity Education** – Learn best practices to stay secure.
// // 4. **Request Help from a Representative** – Connect with an expert.

// // ---

// // **🌐 Scenario: User Reports a Cyberattack**

// // *User:*  
// // "I think my system is under attack. I need help removing malware."

// // **CyberBot’s Response:**  
// // 🔹 Acknowledges urgency, reassures user, and requests critical details.

// // "I understand how concerning this situation can be. Let’s work together to resolve it quickly and securely.  
// // _First, can you tell me what device you’re using? (Windows, Mac, or Mobile)_  
// // This will help me provide you with the most effective steps to contain and remove the malware."

// // ---

// // **🛡️ Step-by-Step Malware Removal Guide**  
// // *User:*  
// // "I’m using Windows."

// // **CyberBot’s Response:**  
// // 🔹 Provides immediate guidance while ensuring clarity.

// // "Thank you for the information. Here are the steps to remove malware from your Windows device safely:

// // - **Step 1: Disconnect from the Internet**  
// //   To prevent the malware from spreading or communicating with external sources, disconnect your device from Wi-Fi or unplug the Ethernet cable.

// // - **Step 2: Boot into Safe Mode**  
// //   Restart your computer and press F8 (or Shift + Restart) to enter Safe Mode. This limits background programs, preventing malware from running.

// // - **Step 3: Run a Full Antivirus Scan**  
// //   Use a trusted security software like Windows Defender or Malwarebytes. Let the scan complete and follow the removal instructions.

// // - **Step 4: Uninstall Suspicious Programs**  
// //   Go to Control Panel → Programs & Features → Look for unfamiliar programs installed recently. Uninstall anything suspicious.

// // - **Step 5: Clear Temporary Files**  
// //   Run Disk Cleanup (search for it in the Windows menu) to remove temporary files that malware might use.

// // - **Step 6: Update Your System and Security Software**  
// //   Ensure Windows and your security software are up to date to protect against future threats.

// // - **Step 7: Monitor for Unusual Activity**  
// //   If your system still behaves strangely, consider restoring your device to a previous state or contacting an expert for further assistance.

// // Would you like me to generate a detailed PDF report with these steps for future reference?

// // ---

// // **🔄 Alternative Approach (For Users Uncertain About the Threat)**

// // *User:*  
// // "I’m not sure if my system is infected, but it’s acting strangely."

// // **CyberBot’s Response:**  
// // 🔹 Guides user to identify potential threats.

// // "Let’s check for common signs of malware. Please review the following symptoms and let me know if any apply to your device:

// // - ✅ Unexpected pop-ups or warnings  
// // - ✅ Slow system performance without reason  
// // - ✅ Programs opening or closing on their own  
// // - ✅ Unusual network activity or unknown processes running  
// // - ✅ Suspicious emails or unauthorized logins

// // If any of these apply to you, I recommend running a full system scan. Would you like guidance on how to do this based on your device type?"

// // ---

// // **🌍 Multi-Device Support**  
// // 🔹 CyberBot tailors its response based on the device type (Windows, Mac, Mobile). Each flow ensures clear, effective guidance without overwhelming the user.

// // - **Windows:** "Run Windows Defender and check Task Manager for unknown processes."  
// // - **Mac:** "Use Activity Monitor to identify unusual processes and run a full scan with Malwarebytes."  
// // - **Mobile:** "Delete unfamiliar apps, reset settings if needed, and scan with a security app."

// // ---

// // **📌 Follow-Up Options**

// // Once the user completes the initial steps, CyberBot follows up:

// // "Did these steps resolve the issue, or do you need further assistance?"

// // - **🟢 Yes, my issue is resolved!** (CyberBot provides prevention tips)  
// // - **🔴 No, I still need help.** (CyberBot escalates the case to an expert or provides additional troubleshooting steps)

// // ---
// // Here are 10 common types of cyberattacks:

// // 1️⃣ **Phishing Attacks** – Fraudulent emails or messages trick users into revealing personal data like passwords or credit card details.

// // 2️⃣ **Malware Attacks** – Malicious software (viruses, worms, Trojans, ransomware) is used to disrupt, damage, or gain unauthorized access to systems.

// // 3️⃣ **Man-in-the-Middle (MitM) Attacks** – An attacker intercepts and alters communication between two parties without their knowledge.

// // 4️⃣ **Denial-of-Service (DoS) & Distributed Denial-of-Service (DDoS) Attacks** – Attackers flood a network or service with excessive traffic, making it unavailable.

// // 5️⃣ **SQL Injection Attacks** – Malicious SQL code is injected into a website’s database to steal or manipulate information.

// // 6️⃣ **Cross-Site Scripting (XSS) Attacks** – Attackers inject malicious scripts into websites, compromising user data.

// // 7️⃣ **Zero-Day Exploits** – A vulnerability is exploited before a security patch is released by developers.

// // 8️⃣ **Ransomware Attacks** – Attackers encrypt files and demand a ransom payment for decryption.

// // 9️⃣ **Credential Stuffing** – Using leaked username/password combinations to gain unauthorized access to accounts.

// // 🔟 **Cryptojacking** – Hackers secretly use a victim’s computer to mine cryptocurrency.

// // ---

// // ### **🛡️ A More Comprehensive List of Cyberattacks**
// // Cyberattacks take many forms, targeting different areas of security. Here’s an extended list:

// // ### **🕵️‍♂️ Social Engineering Attacks**
// // - **Phishing** – Fake emails tricking users into providing sensitive information.
// // - **Spear Phishing** – A more targeted version of phishing aimed at specific individuals.
// // - **Whaling** – Phishing attack targeting high-profile executives.
// // - **Vishing (Voice Phishing)** – Using phone calls to deceive people into revealing credentials.
// // - **Baiting** – Leaving infected USB drives in public places to trick people into plugging them into their computers.
// // - **Pretexting** – Creating a fake scenario to trick victims into providing confidential information.

// // ### **🌐 Network-Based Attacks**
// // - **Man-in-the-Middle (MitM)** – Attackers eavesdrop on communications.
// // - **Denial-of-Service (DoS) & DDoS** – Overloading a system to make it inaccessible.
// // - **DNS Spoofing** – Redirecting users to fake websites by altering DNS records.
// // - **DNS Tunneling** – Hiding malicious data inside DNS queries to bypass security controls.

// // ### **💻 System & Application Exploits**
// // - **SQL Injection** – Inserting malicious code to manipulate a database.
// // - **Cross-Site Scripting (XSS)** – Injecting scripts into web pages that execute when loaded.
// // - **Zero-Day Exploit** – Exploiting software vulnerabilities before patches are available.
// // - **Buffer Overflow** – Overwriting system memory to execute malicious code.
// // - **Privilege Escalation** – Gaining higher access rights than intended.

// // ### **🛠️ Malware-Based Attacks**
// // - **Ransomware** – Encrypting files and demanding payment.
// // - **Spyware** – Secretly monitoring user activity.
// // - **Trojans** – Malicious software disguised as a legitimate program.
// // - **Adware** – Unwanted software that displays advertisements.
// // - **Keyloggers** – Recording keystrokes to steal passwords.

// // ### **🔑 Credential & Identity Attacks**
// // - **Credential Stuffing** – Using leaked credentials on multiple accounts.
// // - **Password Spraying** – Trying common passwords across many accounts.
// // - **Session Hijacking** – Taking control of an active user session.
// // - **Brute Force Attacks** – Systematically guessing passwords.

// // ### **💰 Financial & Cryptographic Attacks**
// // - **Cryptojacking** – Using someone’s system resources to mine cryptocurrency.
// // - **ATM Skimming** – Stealing credit card information from ATMs.
// // - **SIM Swapping** – Hijacking a phone number to intercept two-factor authentication codes.

// // **Remember:** The best defense against these attacks is **awareness and strong security practices!** 🔒

// // ---

// // You are CyberBot, a professional assistant who only answers cybersecurity-related questions.

// // You MUST avoid and refuse to answer unrelated topics such as:
// // - sports
// // - weather
// // - entertainment
// // - general history
// // - politics
// // - non-technical personal opinions
// // - relationship advice

// // If a user asks a question outside the cybersecurity domain, politely respond:
// // "I'm here to help with cybersecurity topics like online safety, ethical hacking, and privacy. Can you ask something related to those?"

// // Always stay in character as CyberBot, the cybersecurity assistant.
// // `;

// // process.on("uncaughtException", (err) => {
// //   console.error("🔥 Uncaught Exception:", err);
// //   process.exit(1);
// // });

// // process.on("unhandledRejection", (reason, promise) => {
// //   console.error("🔥 Unhandled Promise Rejection at:", promise, "reason:", reason);
// // });

// // // ✅ Start the server
// // app.listen(port, () => {
// //   console.log(`🚀 Server running on port ${port}`);
// // });




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
  

//   // const shareChat = (chatId: string) => {
//   //   const shareLink = `http://localhost:3000/chat/${chatId}`; // Replace this with my real domain later when I deploy it in cloud service
//   //   navigator.clipboard.writeText(shareLink);
//   //   alert("✅ Chat link copied to clipboard!");
//   //   setCopied(true);
//   //   setTimeout(() => setCopied(false), 2000);
//   // };

//   const shareChat = (chatId: string) => {
//     // const chat = chatHistory.find((c) => c.id === chatId);
//     // const fullName = chat?.chat_name?.trim() || `Chat ${chatId}`;
//     // const shareLink = `http://localhost:3000/chat/${chatId}`;
  
//     // const content = `${fullName}\n${shareLink}`;
//     // navigator.clipboard.writeText(content);
  
//     // setCopied(true);
//     // setTimeout(() => setCopied(false), 2000);


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
  
//   // 1️⃣ Summarize the bot's message in 4-6 words
//     // const summarizeResponse = async (botText: string): Promise<string | null> => {
//     //   try {
//     //     const summaryPrompt = `Summarize this into a short chat title:\n${botText}`;
//     //     const response = await axios.post("http://localhost:5001/api/summarize", {
//     //       prompt: summaryPrompt,
//     //       model: "gpt-3.5-turbo",
//     //     });
//     //     return response.data?.response?.trim() ?? null;
//     //   } catch (error) {
//     //     console.error("❌ Error summarizing response:", error);
//     //     return null;
//     //   }
//     // };
    
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

//   const userMessage: Message = { text: value, sender: "user" };
//   setValue(""); // ✅ Clear input immediately after capturing the value

//   let currentChatId = activeChatId;

//   if (!currentChatId) {
//     currentChatId = `chat_${userId}_${Date.now()}`;
//     const newChat: ChatSession = {
//       id: currentChatId,
//       chat_name: "New Chat",
//       messages: [userMessage],
//     };
//     setChatHistory((prev) => [...prev, newChat]);
//     setActiveChatId(currentChatId);
//     setMessages([userMessage]);

//     localStorage.setItem("activeChatId", currentChatId.toString());
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



//   //   const aiPersonality = localStorage.getItem("aiPersonality") || "Friendly"; 
//   //   const responseLength = localStorage.getItem("responseLength") || "Medium";
//   //   const personalityPrompt = getPersonalityPrompt(aiPersonality);
//   //   const prompt = `${personalityPrompt}\n\nUser: ${value}\nAI: If the user's question is not related to cybersecurity, respond with: "I specialize in cybersecurity topics! Please ask me something related to online safety, ethical hacking, or privacy." Otherwise, answer the question.`;

    

//   //   const maxTokens = responseLength === "Short" ? 100 : responseLength === "Long" ? 500 : 250;

//   //   try {
//   //       console.log("📡 Sending request to backend..."); 
//   //       console.log("🔹 Request Data:", { prompt, model, maxTokens, userId });

//   //       // const res = await axios.post("http://localhost:5001/api/chat", {
//   //       //     question: prompt,
//   //       //     model,
//   //       //     // max_tokens: maxTokens, // prevent cutting off response before completing the response.
//   //       //     userId, 
//   //       //     chatId: activeChatId || `chat_${userId}_${Date.now()}`,
//   //       // });

//   //       const res = await axios.post("http://localhost:5001/api/chat", {
//   //         prompt,
//   //         question: value, // ✅ Use the user input from your state
//   //         model,
//   //         userId,
//   //         chatId: activeChatId || `chat_${userId}_${Date.now()}`,
//   //       });
        
//   //       console.log("✅ Received response from backend:", res.data);

//   //       const botMessage: Message = { text: res.data?.response || "⚠️ Error: No response received", sender: "bot" };

//   //       // ✅ Immediately update chat history with bot response
//   //       setMessages((prev) => [...prev, botMessage]);

//   //       setChatHistory((prev) =>
//   //           prev.map((chat) =>
//   //               chat.id === activeChatId
//   //                   ? { ...chat, messages: [...chat.messages, botMessage] }
//   //                   : chat
//   //           )
//   //       );

//   //       // ✅ Store the chat history in MongoDB
//   //       await axios.post("http://localhost:5001/api/save-chat-history", {
//   //         userId,
//   //         chatId: activeChatId || `chat_${userId}_${Date.now()}`,
//   //         chatName: "User Chat", // <-- This is currently not used on the backend
//   //         messages: [
//   //           { text: value, sender: "user", timestamp: new Date() },
//   //           { text: botMessage.text, sender: "bot", timestamp: new Date() }
//   //         ]
//   //       });
        

//   //   } catch (error) {
//   //       console.error("❌ Error fetching response:", error);
//   //       const errorMessage: Message = { text: "⚠️ Error: Could not get a response.", sender: "bot" };

//   //       setMessages((prev) => [...prev, errorMessage]);

//   //       setChatHistory((prev) =>
//   //           prev.map((chat) =>
//   //               chat.id === activeChatId
//   //                   ? { ...chat, messages: [...chat.messages, errorMessage] }
//   //                   : chat
//   //           )
//   //       );
//   //   }

//   //   setValue(""); // ✅ Clear input field
//   // };

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
  
//         // const chatSessions: ChatSession[] = res.data.data
//         //   // .filter((chat: ChatData) => chat.chat_id || chat.id)
//         //   .filter((chat: ChatData) => (chat.chat_id || chat.id) && Array.isArray(chat.messages))
//         //   .map((chat: ChatData, index: number) => ({
//         //     id: chat.chat_id || chat.id,
//         //     chat_name: chat.chat_name?.trim() || `Chat ${index + 1}`,
//         //     messages: Array.isArray(chat.messages) ? chat.messages : [],
//         //   }));
//         //   console.log("🧠 Processed chat sessions:", chatSessions);
//         //2
//         // setChatHistory(chatSessions);

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

//   // const handleResetChats = async () => {
//   //   const userId = localStorage.getItem("userId");
//   //   if (!userId) {
//   //     alert("No user ID found.");
//   //     return;
//   //   }
  
//   //   try {
//   //     // Call your backend to delete all chats for this user
//   //     const res = await axios.delete(`http://localhost:5001/api/delete-all-chats/${userId}`);
//   //     console.log("✅ Backend chat reset response:", res.data);
//   //     //localStorage.clear(); // clears everything
//   //     // Clear frontend state
//   //     localStorage.removeItem("activeChatId");
//   //     setChatHistory([]);
//   //     setActiveChatId(null);
//   //     setMessages([]);
//   //     setMenuOpen(null); // ✅ This fixes the dropdown issue after reset
//   //   } catch (err) {
//   //     console.error("❌ Failed to delete chat history from DB:", err);
//   //     alert("Failed to reset chats from backend.");
//   //   }
//   // };


//   // const filteredChats = chatHistory.filter((chat) =>
//   //   chat.chat_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   //   chat.messages.some((msg) =>
//   //     msg.text.toLowerCase().includes(searchQuery.toLowerCase())
//   //   )
//   // );
  
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
//           <img src="../public/assets/chat-plus.svg" alt="New Chat" />
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
//           {messages.map((msg: Message) => (
//             <div key={`${msg.timestamp}-${msg.text}`} className={`message ${msg.sender}`}>
//             {msg.sender === "bot" ? (
//               <ReactMarkdown>{msg.text}</ReactMarkdown>
//             ) : (
//               msg.text
//             )}
//             </div>
//           ))}
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






import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import pkg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OpenAI } from "openai"; // ✅ Added OpenAI for Chatbot
import mongoose from "mongoose";
import ChatHistory from "./src/models/ChatHistory.js"; // Import the model
import crypto from "crypto";
import { pipeline } from "@xenova/transformers"; // 🧠 Use this instead of huggingface's Python API
import Stripe from "stripe";


dotenv.config({ path: "./.env" });
console.log("🔍 MONGO_URI:", process.env.MONGO_URI); // Debugging

// ✅ Initialize Express app FIRST
const app = express();
const port = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // ⚠️ Use a strong secret in .env


// ✅ Subscription setup with Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});


// ✅ MongoDB Connection (AFTER loading env variables)
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI is missing! Check your .env file.");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log(`[${new Date().toISOString()}] ✅ Connected to MongoDB`);
    
    // 🔍 Debugging: Try fetching 1 document
    try {
      const testChat = await ChatHistory.find().limit(5).exec();
      console.log(`[${new Date().toISOString()}] ✅ Found ChatHistory Data:`, testChat);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ❌ Query Error:`, error);
    }
  })
  .catch((err) => {
    console.error(`[${new Date().toISOString()}] ❌ MongoDB Connection Error:`, err);
    process.exit(1);
  });


  mongoose.connection.on("error", (err) => {
    console.error(`[${new Date().toISOString()}] ❌ MongoDB Connection Error:`, err);
  });
  mongoose.connection.once("open", () => {
    console.log(`[${new Date().toISOString()}] ✅ MongoDB Connected Successfully`);
  });
  
//✅ Test MongoDB Connection Route
app.get("/api/test-mongo", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(`[${new Date().toISOString()}] 🔍 Fetching ChatHistory... Page: ${page}, Limit: ${limit}`);

    const testChat = await ChatHistory.find().skip(skip).limit(limit).exec();

    console.log(`[${new Date().toISOString()}] ✅ Fetched ${testChat.length} records`);

    res.json({ success: true, data: testChat, page, limit });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ MongoDB Test Error:`, error);
    res.status(500).json({ error: "MongoDB connection failed" });
  }
});

// ✅ PostgreSQL Connection (Ensure declared once)
const { Pool } = pkg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});


// ✅ Update Content Security Policy (CSP) to allow Chatbot API
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data:; " + // ✅ Allows base64 and inline images
    "connect-src 'self' http://localhost:5001 http://localhost:3000 ws://localhost:5001 wss://localhost:5001;"
  );
  next();
});


app.use(cors({
  origin: "http://localhost:3000", // ✅ Adjust for Vite frontend
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

/* ─────────────────────────────────── */
/* ✅ User Authentication Endpoints    */
/* ─────────────────────────────────── */

// ✅ Registration Endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { question, model, userId, chatId } = req.body;

if (!question || !model || !userId) {
  console.warn("❌ Missing parameters:", { question, model, userId });
  return res.status(400).json({ error: "Missing parameters" });
}

    // ✅ Check if user already exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // ✅ Hash password before storing
    const hashedPassword = bcrypt.hashSync(password, 10);

    // ✅ Insert user into database
    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    return res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Login Authentication Endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Login Attempt:", email);

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      console.warn("❌ User not found:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const storedUser = user.rows[0];
    console.log("✅ User Found:", storedUser.email);

    const isMatch = bcrypt.compareSync(password, storedUser.password);
    if (!isMatch) {
      console.warn("❌ Incorrect password for:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: storedUser.id, // ✅ Includes userId in token
        email: storedUser.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2-hour expiry
      },
      JWT_SECRET
    );

    console.log("✅ Login Successful for:", email);

    // ✅ Ensure `userId` is returned
    return res.json({ 
      message: "Login successful", 
      token, 
      userId: storedUser.id  
    });

  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Middleware to Check JWT Expiration// ✅ Middleware to Check JWT Expiration & Protect Routes
const checkTokenExpiration = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Access Denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.exp * 1000 < Date.now()) {
      console.warn("❌ Token Expired for:", decoded.email);
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Invalid Token:", error);
    return res.status(401).json({ error: "Invalid Token" });
  }
};

// ✅ Protected Route Example
app.get("/api/protected-route", checkTokenExpiration, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});



// ✅ Middleware to Protect Routes (Ensure declared once)
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    console.warn("⚠️ Access denied: No token provided.");
    return res.status(403).json({ error: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.exp * 1000 < Date.now()) {
      console.warn("❌ Token expired for:", decoded.email);
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Invalid Token:", error);
    return res.status(401).json({ error: "Invalid Token" });
  }
};

// ✅ Add this API endpoint
app.get("/api/protected-route", authenticateToken, (req, res) => {
  res.json({ message: "User is authenticated", user: req.user });
});


/* ─────────────────────────────────── */
/* ✅ Chatbot Integration - OpenAI GPT */
/* ─────────────────────────────────── */

// ✅ Load OpenAI API Key (Ensure declared once)
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("❌ OPENAI_API_KEY is missing! Set it in .env");
  process.exit(1);
}

// ✅ Initialize OpenAI (Ensure declared once)
const openai = new OpenAI({ apiKey });

// ✅ Chatbot API Route
app.post("/api/chat", async (req, res) => {
  const { question, prompt, model, userId, chatId } = req.body;

  if (!question || !model || !userId) {
    console.warn("❌ Missing parameters:", { question, model, userId });
    return res.status(400).json({ error: "Missing parameters" });
  }

  if (model === "securebert") {
    try {
      const textWithMask = question.includes("[MASK]") ? question : question + " [MASK]";
      const hfResult = await secureBertPipeline(textWithMask);
  
      const responseText = hfResult?.[0]?.sequence || "No response generated by SecureBERT";
      return res.json({ response: responseText });
    } catch (err) {
      console.error("❌ Hugging Face Error:", err);
      return res.status(500).json({ error: "Hugging Face model failed", details: err.message });
    }
  }
  

  try {
    console.log("📨 Sending request to OpenAI:", { model, question });

    const messages = prompt
      ? [
          { role: "system", content: prompt }, // 🧠 custom personality prompt
          { role: "user", content: question },
        ]
      : [
          { role: "system", content: cyberBotBehavior }, // fallback to default
          { role: "user", content: question },
        ];

    const openaiResponse = await openai.chat.completions.create({
      model,
      max_tokens: 500,
      temperature: 0.7,
      messages,
    });

    const responseText = openaiResponse.choices[0]?.message?.content || "No response generated";
    console.log("✅ OpenAI Response:", responseText);

    const chatEntry = {
      user_id: userId,
      chat_id: chatId,
      chat_name: "User Chat",
      messages: [
        { text: question, sender: "user", timestamp: new Date() },
        { text: responseText, sender: "bot", timestamp: new Date() },
      ],
    };

    // await ChatHistory.findOneAndUpdate(
    //   { chat_id: chatId, user_id: userId},
    //   { $push: { messages: { $each: chatEntry.messages } } },
    //   { upsert: true, new: true }
    // );

    res.json({ response: responseText });
  } catch (error) {
    console.error("❌ Error fetching response:", error?.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to fetch AI response", details: error.message });
  }
});



//working
app.get("/api/chat-history/:userId", async (req, res) => {
  try {
    const chatHistory = await ChatHistory.find({ user_id: req.params.userId });

    if (!chatHistory.length) {
      return res.json({ success: true, data: [] });
    }

    const formattedChats = chatHistory.map((chat) => ({
      id: chat.chat_id,
      chat_name:
        !chat.messages || chat.messages.length === 0
          ? "New Chat"
          : chat.chat_name || `Chat ${chat.chat_id}`,
      messages: chat.messages.map((m) => ({
        text: (() => {
          try {
            return decrypt(m.text);
          } catch (e) {
            console.warn("⚠️ Failed to decrypt message:", e.message);
            return "[Decryption Error]";
          }
        })(),
        sender: m.sender,
        timestamp: m.timestamp || new Date(),
      })),
    }));
    

    res.json({ success: true, data: formattedChats });
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});




app.delete("/api/delete-chat/:userId/:chatId", async (req, res) => {
  const { chatId } = req.params;
  console.log(`🧹 Attempting to delete chat with chatId=${chatId}`);

  try {
    const result = await ChatHistory.deleteOne({ chat_id: chatId });

    if (result.deletedCount === 0) {
      console.warn("❌ No matching chat found to delete");
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    console.log("✅ Chat deleted successfully");
    res.json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting chat:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// app.post("/api/save-chat-history", async (req, res) => {
//   const { userId, chatId, messages } = req.body;

//   if (!userId || !chatId || !messages || !Array.isArray(messages)) {
//     return res.status(400).json({ error: "Invalid parameters" });
//   }

//   try {
//     let chatName = `Chat ${chatId}`;

//     const firstUserMessage = messages.find((m) => m.sender === "user")?.text?.trim();

//     if (firstUserMessage) {
//       try {
//         const openaiResponse = await openai.chat.completions.create({
//           model: "gpt-4",
//           max_tokens: 20,
//           temperature: 0.5,
//           messages: [
//             {
//               role: "system",
//               content: "Generate a short and unique title for this cybersecurity-related conversation. Avoid generic words like 'Help' or 'Chat'.",
//             },
//             { role: "user", content: firstUserMessage },
//           ],
//         });

//         const aiTitle = openaiResponse.choices?.[0]?.message?.content?.trim();
//         if (aiTitle) {
//           chatName = aiTitle;
//         }
//       } catch (err) {
//         console.warn("⚠️ Failed to generate title. Using fallback.");
//       }
//     }

//     console.log(`💬 Saving chat ${chatId} for user ${userId} with name "${chatName}"`);

//     const updatedChat = await ChatHistory.findOneAndUpdate(
//       { chat_id: chatId, user_id: userId },
//       {
//         $setOnInsert: {
//           user_id: userId,
//           chat_id: chatId,
//           chat_name: chatName,
//         },
//         $push: { messages: { $each: messages } },
//       },
//       { upsert: true, new: true }
//     );

//     // If chat already existed, update the name separately
//     if (updatedChat && updatedChat.chat_name !== chatName) {
//       await ChatHistory.updateOne(
//         { chat_id: chatId, user_id: userId },
//         { $set: { chat_name: chatName } }
//       );
//     }

//     res.json({ success: true, chat_name: chatName });
//   } catch (error) {
//     console.error("❌ Save error:", error);
//     res.status(500).json({ error: "Failed to save chat history" });
//   }
// });

app.post("/api/save-chat-history", async (req, res) => {
  const { userId, chatId, messages } = req.body;

  if (!userId || !chatId || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  try {
    let chatName = `Chat ${chatId}`;

    // Get the first user message (decrypted)
    const firstUserMessage = messages.find((m) => m.sender === "user")?.text?.trim();

    if (firstUserMessage) {
      try {
        const openaiResponse = await openai.chat.completions.create({
          model: "gpt-4",
          max_tokens: 20,
          temperature: 0.5,
          messages: [
            {
              role: "system",
              content:
                "Generate a short and unique title for this cybersecurity-related conversation. Avoid generic words like 'Help' or 'Chat'.",
            },
            { role: "user", content: firstUserMessage },
          ],
        });

        const aiTitle = openaiResponse.choices?.[0]?.message?.content?.trim();
        if (aiTitle) {
          chatName = aiTitle;
        }
      } catch (err) {
        console.warn("⚠️ Failed to generate title. Using fallback.");
      }
    }

    console.log(`💬 Saving chat ${chatId} for user ${userId} with name "${chatName}"`);

    // ✅ Encrypt messages before saving
    const encryptedMessages = messages.map((m) => ({
      ...m,
      text: encrypt(m.text),
    }));

    const updatedChat = await ChatHistory.findOneAndUpdate(
      { chat_id: chatId, user_id: userId },
      {
        $setOnInsert: {
          user_id: userId,
          chat_id: chatId,
          chat_name: chatName,
        },
        $push: {
          messages: {
            $each: encryptedMessages,
          },
        },
      },
      { upsert: true, new: true }
    );

    // Update name separately if needed
    if (updatedChat && updatedChat.chat_name !== chatName) {
      await ChatHistory.updateOne(
        { chat_id: chatId, user_id: userId },
        { $set: { chat_name: chatName } }
      );
    }

    res.json({ success: true, chat_name: chatName });
  } catch (error) {
    console.error("❌ Save error:", error);
    res.status(500).json({ error: "Failed to save chat history" });
  }
});


app.post("/api/update-chat-name", async (req, res) => {
  const { userId, chatId, newName } = req.body;

  if (!userId || !chatId || !newName) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // const chat = await ChatHistory.findOneAndUpdate(
    //   { userId, chat_id: chatId },
    //   { chat_name: newName },
    //   { new: true }
    // );  -> changed to

    const chat = await ChatHistory.findOneAndUpdate(
      { user_id: userId, chat_id: chatId },
      { $set: { chat_name: newName } }, 
      { new: true }
    );
    

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({ success: true, data: chat });
  } catch (err) {
    console.error("❌ Error updating chat name:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/api/summarize", async (req, res) => {
  const { messages } = req.body;


  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "No messages to summarize" });
  }

  const userMessages = messages
    .filter((m) => m.sender === "user")
    .map((m) => m.text)
    .join("\n");

  try {
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      max_tokens: 30,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "Summarize this conversation into a short and meaningful title. Avoid generic titles like 'Chat'.",
        },
        {
          role: "user",
          content: userMessages,
        },
      ],
    });

    const summary = openaiResponse.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      return res.status(500).json({ error: "Failed to generate summary" });
    }

    return res.json({ summary });
  } catch (error) {
    console.error("❌ Error summarizing chat:", error?.response?.data || error.message);
    res.status(500).json({ error: "Error generating summary", details: error.message });
  }
});

app.get("/api/test-delete-chat", (req, res) => {
  res.send("✅ Delete route is reachable!");
});

/**
 * ✅ Subscription
 */

app.get("/api/subscription-status", authenticateToken, async (req, res) => {
  // request to access the user table and access the usrId then store into the variable called userId
  const userId = req.user.userId;

  try {
    const result = await pool.query("SELECT is_subscribed FROM users WHERE id = $1", [userId]);
    const isSubscribed = result.rows[0]?.is_subscribed || false;
    res.json({ isSubscribed });
  } catch (err) {
    console.error("❌ Error fetching subscription status:", err);
    res.status(500).json({ error: "Unable to fetch subscription status" });
  }
});


/**
 * ✅ Encryption and Decryption
 */
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "12345678901234567890123456789012"; // 32-byte key for AES-256
const IV_LENGTH = 16;

export function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// export function decrypt(text) {
//   const [ivHex, encryptedText] = text.split(":");
//   const iv = Buffer.from(ivHex, "hex");
//   const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
//   let decrypted = decipher.update(encryptedText, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// }

export function decrypt(text) {
  try {
    if (!text.includes(":")) {
      throw new Error("Malformed encrypted text (missing IV delimiter)");
    }

    const [ivHex, encryptedText] = text.split(":");
    if (ivHex.length !== 32) {
      throw new Error("Invalid IV length");
    }

    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.warn("⚠️ Decryption failed:", err.message);
    return "[Decryption Error]";
  }
}


let secureBertPipeline;

(async () => {
  secureBertPipeline = await pipeline("fill-mask", "Xenova/bert-base-uncased"); // temporary placeholder
  console.log("✅ Hugging Face SecureBERT pipeline loaded");
})();


/**
 * ✅ Subscription: check out session route
 */
app.post("/api/create-checkout-session", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 1000, // $10/month
            product_data: {
              name: "CyberBot Monthly Subscription",
            },
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000`,
      metadata: {
        userId: userId,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe session error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});





/* ─────────────────────────────────── */
/* ✅ CyberBot Behavior (Personality)  */
/* ─────────────────────────────────── */

// CyberBot's Behavior and Identity
const cyberBotBehavior = `🚀 **Improved CyberBot Conversation Flow**

**CyberBot’s Initial Greeting:**  
🔹 *Professional, welcoming, and reassuring.*

"Hello! I am CyberBot, your Cybersecurity Assistant. I specialize in Threat Detection, Incident Response, and Cybersecurity Education. How can I assist you today?"

If you’re experiencing a cybersecurity issue, I’m here to guide you step by step. Please select one of the following options to proceed:

1. **Detect Cyber Threats** – Identify potential security risks.
2. **Incident Response Guidance** – Get help recovering from an attack.
3. **Cybersecurity Education** – Learn best practices to stay secure.
4. **Request Help from a Representative** – Connect with an expert.

---

**🌐 Scenario: User Reports a Cyberattack**

*User:*  
"I think my system is under attack. I need help removing malware."

**CyberBot’s Response:**  
🔹 Acknowledges urgency, reassures user, and requests critical details.

"I understand how concerning this situation can be. Let’s work together to resolve it quickly and securely.  
_First, can you tell me what device you’re using? (Windows, Mac, or Mobile)_  
This will help me provide you with the most effective steps to contain and remove the malware."

---

**🛡️ Step-by-Step Malware Removal Guide**  
*User:*  
"I’m using Windows."

**CyberBot’s Response:**  
🔹 Provides immediate guidance while ensuring clarity.

"Thank you for the information. Here are the steps to remove malware from your Windows device safely:

- **Step 1: Disconnect from the Internet**  
  To prevent the malware from spreading or communicating with external sources, disconnect your device from Wi-Fi or unplug the Ethernet cable.

- **Step 2: Boot into Safe Mode**  
  Restart your computer and press F8 (or Shift + Restart) to enter Safe Mode. This limits background programs, preventing malware from running.

- **Step 3: Run a Full Antivirus Scan**  
  Use a trusted security software like Windows Defender or Malwarebytes. Let the scan complete and follow the removal instructions.

- **Step 4: Uninstall Suspicious Programs**  
  Go to Control Panel → Programs & Features → Look for unfamiliar programs installed recently. Uninstall anything suspicious.

- **Step 5: Clear Temporary Files**  
  Run Disk Cleanup (search for it in the Windows menu) to remove temporary files that malware might use.

- **Step 6: Update Your System and Security Software**  
  Ensure Windows and your security software are up to date to protect against future threats.

- **Step 7: Monitor for Unusual Activity**  
  If your system still behaves strangely, consider restoring your device to a previous state or contacting an expert for further assistance.

Would you like me to generate a detailed PDF report with these steps for future reference?

---

**🔄 Alternative Approach (For Users Uncertain About the Threat)**

*User:*  
"I’m not sure if my system is infected, but it’s acting strangely."

**CyberBot’s Response:**  
🔹 Guides user to identify potential threats.

"Let’s check for common signs of malware. Please review the following symptoms and let me know if any apply to your device:

- ✅ Unexpected pop-ups or warnings  
- ✅ Slow system performance without reason  
- ✅ Programs opening or closing on their own  
- ✅ Unusual network activity or unknown processes running  
- ✅ Suspicious emails or unauthorized logins

If any of these apply to you, I recommend running a full system scan. Would you like guidance on how to do this based on your device type?"

---

**🌍 Multi-Device Support**  
🔹 CyberBot tailors its response based on the device type (Windows, Mac, Mobile). Each flow ensures clear, effective guidance without overwhelming the user.

- **Windows:** "Run Windows Defender and check Task Manager for unknown processes."  
- **Mac:** "Use Activity Monitor to identify unusual processes and run a full scan with Malwarebytes."  
- **Mobile:** "Delete unfamiliar apps, reset settings if needed, and scan with a security app."

---

**📌 Follow-Up Options**

Once the user completes the initial steps, CyberBot follows up:

"Did these steps resolve the issue, or do you need further assistance?"

- **🟢 Yes, my issue is resolved!** (CyberBot provides prevention tips)  
- **🔴 No, I still need help.** (CyberBot escalates the case to an expert or provides additional troubleshooting steps)

---
Here are 10 common types of cyberattacks:

1️⃣ **Phishing Attacks** – Fraudulent emails or messages trick users into revealing personal data like passwords or credit card details.

2️⃣ **Malware Attacks** – Malicious software (viruses, worms, Trojans, ransomware) is used to disrupt, damage, or gain unauthorized access to systems.

3️⃣ **Man-in-the-Middle (MitM) Attacks** – An attacker intercepts and alters communication between two parties without their knowledge.

4️⃣ **Denial-of-Service (DoS) & Distributed Denial-of-Service (DDoS) Attacks** – Attackers flood a network or service with excessive traffic, making it unavailable.

5️⃣ **SQL Injection Attacks** – Malicious SQL code is injected into a website’s database to steal or manipulate information.

6️⃣ **Cross-Site Scripting (XSS) Attacks** – Attackers inject malicious scripts into websites, compromising user data.

7️⃣ **Zero-Day Exploits** – A vulnerability is exploited before a security patch is released by developers.

8️⃣ **Ransomware Attacks** – Attackers encrypt files and demand a ransom payment for decryption.

9️⃣ **Credential Stuffing** – Using leaked username/password combinations to gain unauthorized access to accounts.

🔟 **Cryptojacking** – Hackers secretly use a victim’s computer to mine cryptocurrency.

---

### **🛡️ A More Comprehensive List of Cyberattacks**
Cyberattacks take many forms, targeting different areas of security. Here’s an extended list:

### **🕵️‍♂️ Social Engineering Attacks**
- **Phishing** – Fake emails tricking users into providing sensitive information.
- **Spear Phishing** – A more targeted version of phishing aimed at specific individuals.
- **Whaling** – Phishing attack targeting high-profile executives.
- **Vishing (Voice Phishing)** – Using phone calls to deceive people into revealing credentials.
- **Baiting** – Leaving infected USB drives in public places to trick people into plugging them into their computers.
- **Pretexting** – Creating a fake scenario to trick victims into providing confidential information.

### **🌐 Network-Based Attacks**
- **Man-in-the-Middle (MitM)** – Attackers eavesdrop on communications.
- **Denial-of-Service (DoS) & DDoS** – Overloading a system to make it inaccessible.
- **DNS Spoofing** – Redirecting users to fake websites by altering DNS records.
- **DNS Tunneling** – Hiding malicious data inside DNS queries to bypass security controls.

### **💻 System & Application Exploits**
- **SQL Injection** – Inserting malicious code to manipulate a database.
- **Cross-Site Scripting (XSS)** – Injecting scripts into web pages that execute when loaded.
- **Zero-Day Exploit** – Exploiting software vulnerabilities before patches are available.
- **Buffer Overflow** – Overwriting system memory to execute malicious code.
- **Privilege Escalation** – Gaining higher access rights than intended.

### **🛠️ Malware-Based Attacks**
- **Ransomware** – Encrypting files and demanding payment.
- **Spyware** – Secretly monitoring user activity.
- **Trojans** – Malicious software disguised as a legitimate program.
- **Adware** – Unwanted software that displays advertisements.
- **Keyloggers** – Recording keystrokes to steal passwords.

### **🔑 Credential & Identity Attacks**
- **Credential Stuffing** – Using leaked credentials on multiple accounts.
- **Password Spraying** – Trying common passwords across many accounts.
- **Session Hijacking** – Taking control of an active user session.
- **Brute Force Attacks** – Systematically guessing passwords.

### **💰 Financial & Cryptographic Attacks**
- **Cryptojacking** – Using someone’s system resources to mine cryptocurrency.
- **ATM Skimming** – Stealing credit card information from ATMs.
- **SIM Swapping** – Hijacking a phone number to intercept two-factor authentication codes.

**Remember:** The best defense against these attacks is **awareness and strong security practices!** 🔒

---

You are CyberBot, a professional assistant who only answers cybersecurity-related questions.

You MUST avoid and refuse to answer unrelated topics such as:
- sports
- weather
- entertainment
- general history
- politics
- non-technical personal opinions
- relationship advice

If a user asks a question outside the cybersecurity domain, politely respond:
"I'm here to help with cybersecurity topics like online safety, ethical hacking, and privacy. Can you ask something related to those?"

Always stay in character as CyberBot, the cybersecurity assistant.
`;

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🔥 Unhandled Promise Rejection at:", promise, "reason:", reason);
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});