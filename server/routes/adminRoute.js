import express from "express";
import {
  loginAdmin,
  getDashboardData,
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.get("/dashboard", adminAuth, getDashboardData);

export default adminRouter;