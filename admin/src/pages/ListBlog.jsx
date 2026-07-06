import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import api from "../api/axios";

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blog/all?admin=true");

      if (response.data.success) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const response = await api.delete(`/blog/${id}`);

      if (response.data.success) {
        toast.success("Blog deleted successfully");
        fetchBlogs();
      } else {
        toast.error(response.data.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to delete blog";
      toast.error(errorMsg);
    }
  };

  const togglePublish = async (blog) => {
    try {
      const response = await api.put(
        `/blog/${blog._id}`,
        {
          isPublished: !blog.isPublished,
        }
      );

      if (response.data.success) {
        toast.success(`Blog ${!blog.isPublished ? "Published" : "Unpublished"} Successfully`);
        fetchBlogs();
      } else {
        toast.error(response.data.message || "Failed to update blog");
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to update blog";
      toast.error(errorMsg);
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
                          onClick={() => navigate(`/admin/add-blog/${blog._id}`)}
                          className="
                            border
                            border-blue-300
                            px-3
                            py-1
                            rounded
                            text-xs
                            text-blue-600
                            hover:bg-blue-50
                            cursor-pointer
                          "
                        >
                          Edit
                        </button>

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