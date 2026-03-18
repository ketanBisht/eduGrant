import express from "express";
import {
  applyToScholarship,
  getUserApplications,
  getAllApplications
} from "../controllers/applicationController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (none for applications)

// Protected Student Routes
router.post("/", isAuthenticated, applyToScholarship);
router.get("/user", isAuthenticated, getUserApplications);

// Protected Admin Routes
router.get("/admin", isAuthenticated, isAdmin, getAllApplications);

export default router;
