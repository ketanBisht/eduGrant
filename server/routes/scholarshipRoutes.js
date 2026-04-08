import express from "express";
import {
  getAllScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  getRecommendations
} from "../controllers/scholarshipController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/recommended", isAuthenticated, getRecommendations);

router.route("/")
  .get(getAllScholarships)
  .post(isAuthenticated, isAdmin, createScholarship);

router.route("/:id")
  .get(getScholarshipById)
  .put(isAuthenticated, isAdmin, updateScholarship)
  .delete(isAuthenticated, isAdmin, deleteScholarship);

export default router;
