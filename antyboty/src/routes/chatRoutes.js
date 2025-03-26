// import express from "express";
// import { pool, getMongoCollection } from "../db/db.js"; // ✅ Ensure correct import

// const router = express.Router();

// // ✅ Fetch Chat History from MongoDB & PostgreSQL
// router.get("/chat-history/:email", async (req, res) => {
//   try {
//     const email = req.params.email;

//     // ✅ Get User ID from PostgreSQL
//     const userRes = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
//     if (userRes.rows.length === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     const userId = userRes.rows[0].id;

//     // ✅ Fetch Chat History from MongoDB
//     const chatCollection = getMongoCollection(); // ✅ Ensure MongoDB is connected
//     const chatHistory = await chatCollection.findOne({ user_id: userId });

//     res.json({
//       userId,
//       chatHistory: chatHistory || { message: "No chat history found" },
//     });
//   } catch (err) {
//     console.error("❌ Error fetching chat history:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// export default router;
