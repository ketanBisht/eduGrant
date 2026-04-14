import "dotenv/config"; // Ensure env vars load first
// EduGrant Server Heartbeat - Corrected Port: 5050
import express from "express";
import cors from "cors";
import {
  clerkMiddleware,
  clerkClient,
  requireAuth,
  getAuth,
} from "@clerk/express";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import vaultRoutes from "./routes/vaultRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import savedRoutes from "./routes/savedRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

/* -------------------- MIDDLEWARE -------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // This will be your Vercel URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(clerkMiddleware());

/* -------------------- ROUTES -------------------- */

// Register specialized routes
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/admin", adminRoutes);

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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`
EduGrant API is Live 🚀
Mode: ${process.env.NODE_ENV || 'development'}
Port: ${PORT}
  `);
});




