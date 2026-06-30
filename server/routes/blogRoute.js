import express from "express";
import upload from "../middleware/multer.js";
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
blogRouter.post("/generate", generateContent);

// Blog CRUD Routes
blogRouter.post("/add", upload.single("image"), addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.put("/:id", updateBlog);
blogRouter.delete("/:id", deleteBlog);

export default blogRouter;