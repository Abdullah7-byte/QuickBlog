import express from "express";
import {
  loginAdmin,
  getDashboardData,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.get("/dashboard", getDashboardData);

export default adminRouter;