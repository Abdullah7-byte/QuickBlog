import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import imagekit from "../utils/imageKit.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jwt from "jsonwebtoken";

const verifyAdminToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const [, token] = authHeader.split(" ");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.role === "admin" && decoded.email === process.env.ADMIN_EMAIL;
  } catch (err) {
    return false;
  }
};

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = req.body;

    if (!imagekit) {
      return res.status(500).json({
        success: false,
        message: "Image upload service is not configured on the server.",
      });
    }

    // Upload image to ImageKit
    const file = req.file;

    const uploadedImage = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/quickblog",
      useUniqueFileName: true,
    });

    // Save blog in MongoDB
    const blog = await Blog.create({
      title,
      subTitle,
      description,
      category,
      image: uploadedImage.url,
      isPublished,
    });

    res.status(201).json({
      success: true,
      message: "Blog Added Successfully",
      blog,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin } = req.query;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (!blog.isPublished && admin !== "true") {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (admin === "true") {
      if (!verifyAdminToken(req)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Admin credentials required.",
        });
      }
    }

    res.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllBlogs = async (req, res) => {
  try {
    const { admin } = req.query;

    if (admin === "true") {
      if (!verifyAdminToken(req)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Admin credentials required.",
        });
      }
    }

    const filter = admin === "true" ? {} : { isPublished: true };
    const blogs = await Blog.find(filter);

    res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blog: id });

    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBlog = await Blog.findById(id);

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const { title, subTitle, description, category, isPublished } = req.body;

    let imageUrl = existingBlog.image;

    if (req.file) {
      if (!imagekit) {
        return res.status(500).json({
          success: false,
          message: "Image upload service is not configured on the server.",
        });
      }

      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/quickblog",
        useUniqueFileName: true,
      });

      imageUrl = uploadedImage.url;
    }

    existingBlog.title = title ?? existingBlog.title;
    existingBlog.subTitle = subTitle ?? existingBlog.subTitle;
    existingBlog.description = description ?? existingBlog.description;
    existingBlog.category = category ?? existingBlog.category;
    existingBlog.isPublished =
      isPublished !== undefined
        ? isPublished === "true" || isPublished === true
        : existingBlog.isPublished;
    existingBlog.image = imageUrl;

    await existingBlog.save();

    res.json({
      success: true,
      message: "Blog updated successfully",
      blog: existingBlog,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const generateContent = async (req, res) => {
  try {
    const { title, subTitle } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured on the server.",
      });
    }

    if (!title || !subTitle) {
      return res.status(400).json({
        success: false,
        message: "Title and subtitle are required.",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
    });

    const prompt = `
You are a senior content writer for Forbes and ESPN.

Write a high-quality, SEO-friendly blog article.

Title: ${title}

Subtitle: ${subTitle}

Requirements:
- Return ONLY valid HTML.
- Do NOT return Markdown.
- Do NOT wrap the response inside <html>, <head>, or <body>.
- The first line MUST be:
  <h2>${title}</h2>
- Follow with an engaging introduction inside a <p>.
- Every major section MUST use <h2>.
- Every subsection MUST use <h3>.
- Use <p>, <ul>, <li>, <strong>, <em>, <blockquote>, and <table> wherever appropriate.
- Include a comparison table if the topic allows.
- Include one "Key Takeaways" section using bullet points.
- Include real-world facts and statistics whenever possible.
- Write approximately 1000–1200 words.
- Make the article SEO-friendly.
- Write like an experienced human journalist, not like an AI assistant.
- Vary sentence length and avoid repetitive phrasing.
- Keep the article factually accurate, engaging, and easy to read.
- End with a strong conclusion.
`;

    const result = await model.generateContent(prompt);

    const content = result.response.text();

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const listModels = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured on the server.",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    const data = await response.json();

    res.json({
      success: true,
      models: data.models || data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};