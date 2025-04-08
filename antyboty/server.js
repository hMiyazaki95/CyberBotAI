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



dotenv.config({ path: "./.env" });
console.log("🔍 MONGO_URI:", process.env.MONGO_URI); // Debugging

// ✅ Initialize Express app FIRST
const app = express();
const port = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // ⚠️ Use a strong secret in .env



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
