import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import useAuth from "../context/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[#fcfcff]">
      <div className="flex items-center justify-between py-5 mx-6 sm:mx-12 lg:mx-20 xl:mx-32">
        <img
          src={assets.logo}
          alt="QuickBlog Logo"
          className="w-32 sm:w-40 cursor-pointer"
          onClick={() => navigate("/")}
        />

        {user ? (
          <button
            onClick={handleLogout}
            className="rounded-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 text-white px-7 py-3 font-medium shadow-sm cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="rounded-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 text-white px-7 py-3 font-medium shadow-sm cursor-pointer"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;