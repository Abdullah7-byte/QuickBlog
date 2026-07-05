import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.json({
        success: true,
        token,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const getDashboardData = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();

    const totalDrafts = await Blog.countDocuments({
      isPublished: false,
    });

    const totalComments = await Comment.countDocuments();

    const latestBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      dashboardData: {
        totalBlogs,
        totalDrafts,
        totalComments,
        latestBlogs,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};