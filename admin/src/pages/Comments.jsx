import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import api from "../api/axios";

const Comments = () => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const response = await api.get("/comment/all");

      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const approveComment = async (id) => {
    try {
      const response = await api.put(`/comment/approve/${id}`);

      if (response.data.success) {
        toast.success("Comment approved successfully");
        fetchComments();
      } else {
        toast.error(response.data.message || "Failed to approve comment");
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to approve comment";
      toast.error(errorMsg);
    }
  };

  const deleteComment = async (id) => {
    try {
      const response = await api.delete(`/comment/${id}`);

      if (response.data.success) {
        toast.success("Comment deleted successfully");
        fetchComments();
      } else {
        toast.error(response.data.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to delete comment";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-700">
              Comments
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead>
                <tr className="border-b border-gray-200 text-gray-500">

                  <th className="text-left px-5 py-3 font-medium">
                    BLOG TITLE & COMMENT
                  </th>

                  <th className="text-left px-5 py-3 font-medium">
                    DATE
                  </th>

                  <th className="text-left px-5 py-3 font-medium">
                    ACTIONS
                  </th>

                </tr>
              </thead>

              <tbody>

                {comments.map((item) => (

                  <tr
                    key={item._id}
                    className="border-b border-gray-100 last:border-none"
                  >

                    <td className="px-5 py-5">

                      <p className="font-medium text-gray-800">
                        Blog:
                      </p>

                      <p className="text-gray-600 mt-1">
                        {item.blog?.title || "Deleted Blog"}
                      </p>

                      <div className="mt-4">
                        <p className="font-medium text-gray-800">
                          Name:
                        </p>

                        <p className="text-gray-600">
                          {item.user?.name || "Unknown User"}
                        </p>
                      </div>

                      <div className="mt-3">
                        <p className="font-medium text-gray-800">
                          Comment:
                        </p>

                        <p className="text-gray-600">
                          {item.content}
                        </p>
                      </div>

                    </td>

                    <td className="px-5 py-5 text-gray-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-5">

                      <div className="flex items-center gap-4">

                        {!item.isApproved && (
                          <button
                            onClick={() => approveComment(item._id)}
                            className="text-green-600 text-lg hover:scale-110 transition cursor-pointer"
                          >
                            ✓
                          </button>
                        )}

                        <button
                          onClick={() => deleteComment(item._id)}
                          className="text-gray-500 text-lg hover:scale-110 transition cursor-pointer"
                        >
                          🗑
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

export default Comments;