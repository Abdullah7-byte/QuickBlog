import { useState } from "react";
import BlogCard from "./BlogCard";

const categories = [
  "All",
  "Technology",
  "Startup",
  "Lifestyle",
  "Finance",
];

const Hero = ({ blogs, loading }) => {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredBlogs = blogs.filter((blog) => {
    const categoryMatch =
      category === "All" || blog.category === category;

    const searchMatch = blog.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#fcfbff] via-[#ffffff] to-[#f8fbff] px-4 py-16 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.03),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.03),transparent_50%)]" />

      <div className="relative text-center max-w-6xl mx-auto">
        <p className="inline-flex items-center rounded-full border border-indigo-100 bg-white px-5 py-2 text-sm font-medium text-indigo-600 shadow-sm">
          New: AI feature integrated
        </p>

        <h1 className="mt-8 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900">
          Your own{" "}
          <span className="text-indigo-500">blogging</span>
          <br />
          platform.
        </h1>

        <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-600 leading-8">
          This is your space to think out loud, to share what matters,
          and to write without filters.
        </p>

        <div className="flex max-w-3xl mx-auto mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg shadow-indigo-100/40">
          <input
            type="text"
            placeholder="Search blogs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-6 py-4 outline-none text-gray-700"
          />

          <button className="bg-indigo-500 px-10 text-white font-medium transition hover:bg-indigo-600">
            Search
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-6 py-3 text-sm font-medium transition ${
                category === item
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-14 rounded-3xl p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-16 text-center text-gray-500 text-lg">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-4"></div>
                <p>Loading blogs...</p>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="col-span-full py-16 text-center text-gray-500 text-lg">
                No blogs found. Try a different search or category.
              </div>
            ) : (
              filteredBlogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  _id={blog._id}
                  title={blog.title}
                  category={blog.category}
                  description={blog.subTitle}
                  image={blog.image}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;