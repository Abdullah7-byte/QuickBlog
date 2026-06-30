import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Startup");
  const [publish, setPublish] = useState(false);
  const [image, setImage] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async () => {
    if (!title.trim()) {
      return toast.error("Please enter blog title.");
    }

    if (!subTitle.trim()) {
      return toast.error("Please enter blog subtitle.");
    }

    if (!description.trim()) {
      return toast.error("Please generate or write blog content.");
    }

    if (!image) {
      return toast.error("Please upload a thumbnail.");
    }

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("subTitle", subTitle);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("isPublished", publish);
      formData.append("image", image);

      const response = await axios.post(
        `${apiBase}/api/blog/add`,
        formData
      );

      if (response.data.success) {
        toast.success("🎉 Blog Added Successfully");

        setTitle("");
        setSubTitle("");
        setDescription("");
        setCategory("Startup");
        setPublish(false);
        setImage(null);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  const generateWithAI = async () => {
    if (!title.trim() || !subTitle.trim()) {
      toast.error("Please enter title and subtitle first.");
      return;
    }

    setGenerating(true);

    try {
      const response = await axios.post(
        `${apiBase}/api/blog/generate`,
        {
          title,
          subTitle,
        }
      );

      if (response.data.success) {
        setDescription(response.data.content);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate content.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl">

        <div className="bg-white border border-gray-200 rounded-xl p-6">

          {/* Upload Thumbnail */}

<div>
  <p className="text-sm font-medium text-gray-700 mb-3">
    Upload thumbnail
  </p>

  <label
    className="
      w-32
      h-32
      border-2
      border-dashed
      border-gray-300
      rounded-xl
      flex
      items-center
      justify-center
      overflow-hidden
      cursor-pointer
      hover:border-primary
      transition
    "
  >
    {image ? (
      <img
        src={URL.createObjectURL(image)}
        alt="Thumbnail Preview"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="flex flex-col items-center text-gray-500">
        <span className="text-3xl">☁️</span>
        <p className="text-xs mt-2">Upload</p>
      </div>
    )}

    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => setImage(e.target.files[0])}
    />
  </label>

  {image && (
    <p className="mt-2 w-32 truncate text-xs text-gray-500">
      {image.name}
    </p>
  )}
</div>

          {/* Blog Title */}

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Blog title
            </p>

            <input
              type="text"
              placeholder="Type here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-4
                py-3
                outline-none
              "
            />
          </div>

          {/* Subtitle */}

          <div className="mt-5">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Sub title
            </p>

            <input
              type="text"
              placeholder="Type here"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-4
                py-3
                outline-none
              "
            />
          </div>

          {/* Description */}

          <div className="mt-5">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Blog description
            </p>

            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
            />

            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={generateWithAI}
                disabled={generating}
                className="
                  bg-gray-800
                  text-white
                  text-sm
                  px-5
                  py-2.5
                  rounded-lg
                  flex
                  items-center
                  gap-2
                  transition
                  hover:bg-gray-900
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
            >
          {generating ? (
  <>
    <Loader2 className="w-4 h-4 animate-spin" />
    Generating Article...
  </>
) : (
  <>
    <Sparkles className="w-4 h-4" />
    Generate with AI
  </>
)}
          </button>
            </div>
          </div>

          {/* Category */}

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Blog category
            </p>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="
                border
                border-gray-300
                rounded-lg
                px-4
                py-2.5
                text-sm
              "
            >
              <option value="Startup">Startup</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          {/* Publish */}

          <div className="mt-5 flex items-center gap-2">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
            />

            <p className="text-sm text-gray-700">
              Publish now
            </p>
          </div>

          {/* Submit */}

          <button
          onClick={handleSubmit}
          disabled={uploading}
          className="
            mt-6
            bg-primary
            text-white
            px-8
            py-3
            rounded-lg
            font-medium
            flex
            items-center
            justify-center
            gap-2
            transition
            disabled:opacity-60
            disabled:cursor-not-allowed
        "
      >
          {uploading ? (
  <>
    <Loader2 className="w-5 h-5 animate-spin" />
    Publishing...
  </>
) : (
  <>
    Publish Blog
  </>
)}
</button>

        </div>
      </div>
    </Layout>
  );
};

export default AddBlog;