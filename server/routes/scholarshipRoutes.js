import express from "express";
import {
  getAllScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship
} from "../controllers/scholarshipController.js";

const router = express.Router();

router.route("/")
  .get(getAllScholarships)
  .post(createScholarship);

router.route("/:id")
  .get(getScholarshipById)
  .put(updateScholarship)
  .delete(deleteScholarship);

export default router;
