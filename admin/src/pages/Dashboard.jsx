import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import {
  NotebookPen,
  MessageSquareText,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBlogs: 0,
    totalDrafts: 0,
    totalComments: 0,
    latestBlogs: [],
  });

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/admin/dashboard");

      if (response.data.success) {
        setDashboardData(response.data.dashboardData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const togglePublish = async (blog) => {
    try {
      const response = await api.put(`/blog/${blog._id}`, {
        isPublished: !blog.isPublished,
      });

      if (response.data.success) {
        toast.success(`Blog ${!blog.isPublished ? "Published" : "Unpublished"} Successfully`);
        fetchDashboardData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update blog status");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Layout>
      {/* Cards */}

      <div className="flex gap-4 mb-8">
        <StatCard
          count={dashboardData.totalBlogs}
          title="Blogs"
          icon={<NotebookPen size={22} className="text-primary" />}
        />

        <StatCard
          count={dashboardData.totalComments}
          title="Comments"
          icon={<MessageSquareText size={22} className="text-primary" />}
        />

        <StatCard
          count={dashboardData.totalDrafts}
          title="Drafts"
          icon={<FileText size={22} className="text-primary" />}
        />
      </div>

      {/* Latest Blogs */}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Latest Blogs</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">BLOG TITLE</th>
                <th className="px-4 py-3">DATE</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {dashboardData.latestBlogs.map((blog, index) => (
                <tr key={blog._id} className="border-b">
                  <td className="px-4 py-3">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3">
                    {blog.title}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>

                  <td
                    className={`px-4 py-3 ${
                      blog.isPublished
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    {blog.isPublished ? "Published" : "Draft"}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(blog)}
                      className="border px-3 py-1 rounded text-xs hover:bg-gray-100 cursor-pointer"
                    >
                      {blog.isPublished
                        ? "Unpublish"
                        : "Publish"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;