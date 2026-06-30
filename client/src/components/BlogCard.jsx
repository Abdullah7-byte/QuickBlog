import { Link } from "react-router-dom";

const BlogCard = ({
  _id,
  title,
  category,
  description,
  image
}) => {
  return (
    <div className="group border border-gray-200 rounded-lg overflow-hidden bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="p-5">
        <p className="text-primary font-medium">
          {category}
        </p>

        <h2 className="text-xl font-semibold mt-2 text-gray-900 leading-snug">
          {title}
        </h2>

        <p className="text-gray-500 mt-2 leading-7">
          {description}
        </p>

        <Link to={`/blog/${_id}`} className="mt-4 inline-block font-medium text-primary hover:opacity-90 transition">
          Read More →
        </Link>
      </div>

    </div>
  );
};

export default BlogCard;