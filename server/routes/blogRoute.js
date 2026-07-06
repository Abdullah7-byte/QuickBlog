import express from "express";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  addBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
  generateContent,
} from "../controllers/blogController.js";

const blogRouter = express.Router();

// AI Route
blogRouter.post("/generate", adminAuth, generateContent);

// Blog CRUD Routes
blogRouter.post("/add", adminAuth, upload.single("image"), addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.put("/:id", adminAuth, upload.single("image"), updateBlog);
blogRouter.delete("/:id", adminAuth, deleteBlog);

export default blogRouter;