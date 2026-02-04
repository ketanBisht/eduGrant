

import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import {
  clerkMiddleware,
  clerkClient,
  requireAuth,
  getAuth,
} from "@clerk/express";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(clerkMiddleware());



connectDB();

/* -------------------- ROUTES -------------------- */

// Public route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// Protected route
app.get("/protected", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);

  const user = await clerkClient.users.getUser(userId);

  return res.json({
    message: "Protected route accessed ✅",
    user,
  });
});

/* -------------------- SERVER -------------------- */
app.listen(PORT, () => {
  console.log("URI CHECK →", process.env.MONGO_URI);

  console.log(`Server running at http://localhost:${PORT}`);
});



// import "dotenv/config";
// import express from "express";
// import { clerkMiddleware, clerkClient, requireAuth, getAuth } from "@clerk/express";

// const app = express();
// const PORT = 3000;

// app.use(clerkMiddleware());

// // Use requireAuth() to protect this route
// // If user isn't authenticated, requireAuth() will redirect back to the homepage
// app.get("/protected", requireAuth(), async (req, res) => {
//   // Use `getAuth()` to get the user's `userId`
//   const { userId } = getAuth(req);

//   // Use Clerk's JS Backend SDK to get the user's User object
//   const user = await clerkClient.users.getUser(userId);

//   return res.json({ user });
// });

// // Start the server and listen on the specified port
// app.listen(PORT, () => {
//   console.log(`Example app listening at http://localhost:${PORT}`);
// });
