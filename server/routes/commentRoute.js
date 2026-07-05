import express from "express";
import auth from "../middleware/auth.js";
import {
  addComment,
  getComments,
  getAllComments,
  approveComment,
  deleteComment,
} from "../controllers/commentController.js";

const commentRouter = express.Router();

// Admin Routes
commentRouter.get("/all", getAllComments);
commentRouter.put("/approve/:id", approveComment);
commentRouter.delete("/:id", deleteComment);

// Client Routes
commentRouter.post("/add", auth, addComment);
commentRouter.get("/:blogId", getComments);

export default commentRouter;