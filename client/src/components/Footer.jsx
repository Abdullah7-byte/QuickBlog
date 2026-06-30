import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-gray-200 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div>
          <div className="flex items-center gap-3">
            <img
              src={assets.logo}
              alt="logo"
              className="w-32"
            />
          </div>

          <p className="text-gray-500 mt-2 text-sm">
            Write. Share. Grow.
          </p>
        </div>

        <p className="text-gray-500 text-sm">
          © 2026 QuickBlog. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;