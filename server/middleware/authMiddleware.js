import { clerkClient } from "@clerk/express";
import prisma from "../config/prisma.js";

// 1. Clerk User Sync & Authentication Middleware
export const isAuthenticated = async (req, res, next) => {
  try {
    // @clerk/express attaches req.auth if the user is logged in
    const { userId } = req.auth || {};

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - No Clerk token provided" });
    }

    // Attempt to find the user in our DB
    let student = await prisma.student.findUnique({ 
        where: { clerkId: userId } 
    });

    // If they don't exist in our DB yet, fetch from Clerk and sync
    if (!student) {
      const clerkUser = await clerkClient.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || email;

      student = await prisma.student.create({
        data: {
            clerkId: userId,
            name,
            email,
            role: "STUDENT" // default role in Prisma enum
        }
      });
    }

    // Attach student document to req.user for downstream controllers
    req.user = student;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ success: false, message: "Authentication failed", error: error.message });
  }
};

// 2. Admin verification middleware
export const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "ADMIN" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Forbidden - Admin access required" });
  }
};
