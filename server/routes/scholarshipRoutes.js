import express from "express";
import {
  getAllScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship
} from "../controllers/scholarshipController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getAllScholarships)
  .post(isAuthenticated, isAdmin, createScholarship);

router.route("/:id")
  .get(getScholarshipById)
  .put(isAuthenticated, isAdmin, updateScholarship)
  .delete(isAuthenticated, isAdmin, deleteScholarship);

export default router;
