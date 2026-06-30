import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

const Blog = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch Blog
  const fetchBlog = async () => {
    try {
      const response = await axios.get(
        `${apiBase}/api/blog/${id}`
      );

      if (response.data.success) {
        setBlog(response.data.blog);
      } else {
        setError(true);
      }
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Approved Comments
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${apiBase}/api/comment/${id}`
      );

      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, []);

  // Submit Comment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !comment.trim()) return;

    try {
      const response = await axios.post(
        `${apiBase}/api/comment/add`,
        {
          blog: id,
          name,
          content: comment,
        }
      );

      if (response.data.success) {
        toast.success("Comment submitted for approval.");

        setName("");
        setComment("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit comment.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-500 font-medium">
        Loading...
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Blog Not Found</h1>
          <p className="text-gray-600 mb-8 max-w-md">
            The blog post you are looking for might have been unpublished, deleted, or the URL may be incorrect.
          </p>
          <a href="/" className="bg-primary text-white px-6 py-3 rounded-full hover:opacity-90 transition font-medium">
            Go to Homepage
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center leading-tight">
            {blog.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
            <span>
              Published {new Date(blog.createdAt).toLocaleDateString()}
            </span>

            <span className="h-1 w-1 rounded-full bg-gray-300" />

            <span>QuickBlog Editorial</span>

            <span className="h-1 w-1 rounded-full bg-gray-300" />

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-600 font-medium">
              {blog.category}
            </span>
          </div>

          <p className="text-gray-500 mt-4 text-center text-lg max-w-2xl mx-auto">
            {blog.subTitle}
          </p>

          <div className="mt-10">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-80 md:h-[500px] object-cover rounded-2xl shadow-sm"
            />
          </div>

          <div
            className="blog-content mt-8"
            dangerouslySetInnerHTML={{
              __html: blog.description,
            }}
          />
        </article>

        {/* Comment Form */}

        <section className="mt-16 border-t border-gray-200 pt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Leave a Comment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4"
            />

            <textarea
              rows="4"
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4"
            />

            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-xl hover:opacity-90 transition cursor-pointer"
            >
              Submit Comment
            </button>
          </form>
        </section>

        {/* Comments */}

        <section className="mt-16 border-t border-gray-200 pt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="font-medium text-gray-800">
                No comments yet.
              </p>

              <p className="text-gray-500 mt-2">
                Be the first to share your thoughts.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded-xl p-5 bg-white"
                >
                  <h3 className="font-semibold text-gray-900">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-gray-600">
                    {item.content}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;