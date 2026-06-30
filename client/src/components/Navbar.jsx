import React from "react";
import { assets } from "../assets/assets";

const Navbar = () => {
  return (
    <nav className="bg-[#fcfcff]">
      <div className="flex items-center justify-between py-5 mx-6 sm:mx-12 lg:mx-20 xl:mx-32">
        <img
          src={assets.logo}
          alt="QuickBlog Logo"
          className="w-32 sm:w-40"
        />

        <button
          onClick={() => {
            window.location.href = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";
          }}
          className="flex items-center gap-2 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 text-white px-7 py-3 font-medium shadow-sm cursor-pointer"
        >
          Login
          <img
            src={assets.arrow}
            alt="Arrow"
            className="w-4"
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;