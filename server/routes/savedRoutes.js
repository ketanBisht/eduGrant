import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { saveScholarship, unsaveScholarship, getSavedScholarships } from "../controllers/savedController.js";

const router = express.Router();

router.post("/", isAuthenticated, saveScholarship);
router.delete("/:scholarshipId", isAuthenticated, unsaveScholarship);
router.get("/", isAuthenticated, getSavedScholarships);

export default router;
