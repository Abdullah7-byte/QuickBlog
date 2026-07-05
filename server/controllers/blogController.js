import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import imagekit from "../utils/imageKit.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = req.body;

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

    if (!blog || (!blog.isPublished && admin !== "true")) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
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