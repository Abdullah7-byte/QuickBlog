import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <h1 className="text-[22px] font-bold leading-none">
        <span className="text-primary">Quick</span>Blog
      </h1>

      <button
        onClick={logout}
        className="bg-primary text-white text-sm px-7 py-2.5 rounded-full font-medium hover:opacity-90 transition"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;