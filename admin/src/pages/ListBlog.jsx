import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        `${apiBase}/api/blog/all?admin=true`
      );

      if (response.data.success) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const response = await axios.delete(
        `${apiBase}/api/blog/${id}`
      );

      if (response.data.success) {
        toast.success("Blog deleted successfully");
        fetchBlogs();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete blog");
    }
  };

  const togglePublish = async (blog) => {
    try {
      const response = await axios.put(
        `${apiBase}/api/blog/${blog._id}`,
        {
          isPublished: !blog.isPublished,
        }
      );

      if (response.data.success) {
        toast.success(`Blog ${!blog.isPublished ? "Published" : "Unpublished"} Successfully`);
        fetchBlogs();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update blog");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-700">
              All Blogs
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-medium">#</th>

                  <th className="text-left px-5 py-3 font-medium">
                    BLOG TITLE
                  </th>

                  <th className="text-left px-5 py-3 font-medium">
                    DATE
                  </th>

                  <th className="text-left px-5 py-3 font-medium">
                    STATUS
                  </th>

                  <th className="text-left px-5 py-3 font-medium">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody>
                {blogs.map((blog, index) => (
                  <tr
                    key={blog._id}
                    className="border-b border-gray-100 last:border-none"
                  >
                    <td className="px-5 py-4 text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4 max-w-[300px]">
                      <p className="truncate text-gray-700 font-medium">
                        {blog.title}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`text-sm ${
                          blog.isPublished
                            ? "text-green-600 font-medium"
                            : "text-orange-500 font-medium"
                        }`}
                      >
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => togglePublish(blog)}
                          className="
                            border
                            border-gray-300
                            px-3
                            py-1
                            rounded
                            text-xs
                            text-gray-600
                            hover:bg-gray-100
                            cursor-pointer
                          "
                        >
                          {blog.isPublished ? "Unpublish" : "Publish"}
                        </button>

                        <button
                          onClick={() => deleteBlog(blog._id)}
                          className="
                            w-7
                            h-7
                            rounded-full
                            border
                            border-red-200
                            text-red-500
                            flex
                            items-center
                            justify-center
                            hover:bg-red-50
                            cursor-pointer
                          "
                        >
                          ×
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListBlog;