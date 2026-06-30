import express from "express";
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
commentRouter.post("/add", addComment);
commentRouter.get("/:blogId", getComments);

export default commentRouter;