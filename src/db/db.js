// import pkg from "pg"; // ✅ Import PostgreSQL correctly
// import { MongoClient } from "mongodb";
// import dotenv from "dotenv";

// dotenv.config();

// const { Pool } = pkg; // ✅ Extract Pool from CommonJS module

// const MONGO_URI = process.env.MONGO_URI;
// const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

// // ✅ PostgreSQL Connection
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: Number(process.env.DB_PORT),
// });

// pool.connect()
//   .then(() => console.log("✅ Connected to PostgreSQL"))
//   .catch(err => console.error("❌ PostgreSQL Connection Error:", err));

// // ✅ MongoDB Connection
// const mongoClient = new MongoClient(MONGO_URI);
// let db;
// let chatCollection;

// async function connectMongoDB() { // ✅ Renamed to correct function
//   try {
//     await mongoClient.connect();
//     db = mongoClient.db(MONGO_DB_NAME);
//     chatCollection = db.collection("chat_history");
//     console.log("✅ Connected to MongoDB");
//   } catch (err) {
//     console.error("❌ MongoDB Connection Error:", err);
//   }
// }

// function getMongoCollection() {
//   if (!chatCollection) {
//     throw new Error("❌ MongoDB is not connected.");
//   }
//   return chatCollection;
// }

// // ✅ Ensure all required functions are exported correctly
// export { connectMongoDB, getMongoCollection, pool };
