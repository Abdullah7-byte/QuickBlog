  import express from "express";
  import auth from "../middleware/auth.js";
  import {
    registerUser,
    verifyEmail,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
  } from "../controllers/userController.js";

  const userRouter = express.Router();

  userRouter.post("/register", registerUser);
  userRouter.post("/verify-email", verifyEmail);
  userRouter.post("/login", loginUser);
  userRouter.post("/forgot-password", forgotPassword);
  userRouter.post("/reset-password", resetPassword);
  userRouter.get("/profile", auth, getUserProfile);

  export default userRouter;