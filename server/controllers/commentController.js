import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;

    const comment = await Comment.create({
      blog,
      name,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Comment Added Successfully",
      comment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("blog", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveComment = async (req, res) => {
  try {
    const { id } = req.params;

    await Comment.findByIdAndUpdate(id, {
      isApproved: true,
    });

    res.json({
      success: true,
      message: "Comment Approved",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    await Comment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Comment Deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};