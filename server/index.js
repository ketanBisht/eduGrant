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
import { initCronJobs } from "./services/cronService.js";

const app = express();
const PORT = process.env.PORT || 3000;

/* -------------------- MIDDLEWARE -------------------- */
const rawFrontendUrl = process.env.FRONTEND_URL || "";
const sanitizedFrontendUrl = rawFrontendUrl.replace(/\/$/, ""); // Remove trailing slash

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  sanitizedFrontendUrl,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if origin matches or is a subdomain of sanitizedFrontendUrl
    const isAllowed = allowedOrigins.some(allowed => {
      const cleanAllowed = allowed.replace(/\/$/, "");
      return origin === cleanAllowed;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked]: Origin ${origin} is not in allowedOrigins:`, allowedOrigins);
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

// 404 Catch-all for Debugging
app.use((req, res) => {
  console.warn(`[404 Not Found]: ${req.method} ${req.url} - Origin: ${req.get('origin')}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found on this server.`
  });
});

/* -------------------- SERVER -------------------- */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`
EduGrant API is Live 🚀
Mode: ${process.env.NODE_ENV || 'development'}
Port: ${PORT}
  `);
  
  // Initialize background tasks
  initCronJobs();
});




