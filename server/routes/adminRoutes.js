import express from "express";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";
import { 
    getStats,
    getAllUsers,
    deleteUser
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", isAuthenticated, isAdmin, getStats);
router.get("/users", isAuthenticated, isAdmin, getAllUsers);
router.delete("/users/:id", isAuthenticated, isAdmin, deleteUser);

export default router;
