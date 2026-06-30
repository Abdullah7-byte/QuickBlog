import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    if (e) e.preventDefault();
    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post(
        `${apiBase}/api/admin/login`,
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center px-4">
      <form onSubmit={onSubmitHandler} className="w-full max-w-[380px] bg-white border border-gray-200 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center">
          <span className="text-primary">Admin</span> Login
        </h1>

        <p className="text-gray-500 text-center text-sm mt-2">
          Enter your credentials to access the admin panel
        </p>

        <div className="mt-8">
          <label htmlFor="email_field" className="text-sm text-gray-700 font-medium">
            Email
          </label>

          <input
            id="email_field"
            type="email"
            placeholder="your email id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 border-b border-gray-300 py-2 outline-none focus:border-primary transition-colors"
            required
          />
        </div>

        <div className="mt-6">
          <label htmlFor="password_field" className="text-sm text-gray-700 font-medium">
            Password
          </label>

          <input
            id="password_field"
            type="password"
            placeholder="your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-2 border-b border-gray-300 py-2 outline-none focus:border-primary transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-md mt-8 font-medium hover:opacity-90 transition cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;