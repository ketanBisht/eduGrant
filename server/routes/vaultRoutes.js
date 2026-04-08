import express from "express";
import { 
  uploadDocument, 
  getStudentDocuments, 
  deleteDocument 
} from "../controllers/VaultController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/")
  .get(getStudentDocuments)
  .post(uploadDocument);

router.route("/:id")
  .delete(deleteDocument);

export default router;
