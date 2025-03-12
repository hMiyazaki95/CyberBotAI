
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import pkg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OpenAI } from "openai"; // ✅ Added OpenAI for Chatbot

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // ⚠️ Use a strong secret in .env

// ✅ PostgreSQL Connection (Ensure declared once)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

app.use(cors({
  origin: "http://localhost:3000", // ✅ Adjust for Vite frontend
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true
}));

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



app.use(bodyParser.json());
app.use(express.json());

/* ─────────────────────────────────── */
/* ✅ User Authentication Endpoints    */
/* ─────────────────────────────────── */

// ✅ Registration Endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
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
    console.log("🔍 Login Attempt:", email); // ✅ Debug Log

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      console.warn("❌ User not found:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const storedUser = user.rows[0];
    console.log("✅ User Found:", storedUser.email); // ✅ Debug Log

    const isMatch = bcrypt.compareSync(password, storedUser.password);
    if (!isMatch) {
      console.warn("❌ Incorrect password for:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: storedUser.id,
        email: storedUser.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // ✅ Explicit expiration (2 hours)
      },
      JWT_SECRET
    );

    console.log("✅ Login Successful for:", email);
    return res.json({ message: "Login successful", token });

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
  const { question, model } = req.body;
  console.log("📥 Received request:", { question, model });

  if (!question || !model) {
    console.warn("❌ Missing 'question' or 'model'");
    return res.status(400).json({ error: "Missing 'question' or 'model'" });
  }

  try {
    console.log("🔗 Sending request to OpenAI...");
    
    const openaiResponse = await openai.chat.completions.create({
      model: model,
      max_tokens: 300,
      messages: [
        { role: "system", content: cyberBotBehavior },
        { role: "user", content: question },
      ],
    });

    let responseText = openaiResponse.choices[0]?.message?.content || "No response generated";

    // ✅ Ensure response uses Markdown-friendly formatting
    responseText = responseText.replace(/\n/g, "\n\n"); // ✅ Adds extra spacing for clarity

    console.log("✅ OpenAI Response:", responseText);

    return res.json({ response: responseText });

  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    return res.status(500).json({ error: "Failed to fetch AI response" });
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

**🚀 Key Enhancements in This Version**

- ✅ More Professional & User-Friendly  
  - No robotic repetition; natural and engaging.
  - Acknowledges urgency while remaining calm and professional.
  - Uses structured responses with clear action steps.
- ✅ Context-Aware & Adaptive  
  - Detects beginner vs. advanced users and adjusts responses.
  - Provides device-specific guidance.
- ✅ Prevention & Follow-Up Options  
  - Offers security recommendations after solving the problem.
  - Lets users generate PDF reports for future reference.
`;

// ✅ Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
