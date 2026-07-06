import express from "express";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  addComment,
  getComments,
  getAllComments,
  approveComment,
  deleteComment,
} from "../controllers/commentController.js";

const commentRouter = express.Router();

// Admin Routes
commentRouter.get("/all", adminAuth, getAllComments);
commentRouter.put("/approve/:id", adminAuth, approveComment);
commentRouter.delete("/:id", adminAuth, deleteComment);

// Client Routes
commentRouter.post("/add", auth, addComment);
commentRouter.get("/:blogId", getComments);

export default commentRouter;