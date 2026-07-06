import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import api from "../api/axios";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blog/all");

      if (response.data.success) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <Navbar />
      <Hero blogs={blogs} loading={loading} />
      <Footer />
    </div>
  );
};

export default Home;