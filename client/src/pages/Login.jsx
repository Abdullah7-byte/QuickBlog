import { useState } from "react";
import useAuth from "../context/useAuth";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthCard from "../components/AuthCard";
import AuthField from "../components/AuthField";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLogin ? "/user/login" : "/user/register";

      const { data } = await api.post(endpoint, formData);

      if (data.success) {
        toast.success(data.message);

        if (isLogin) {
          login(data.token, data.user);

          const redirect =
            localStorage.getItem("redirectAfterLogin") || "/";

          localStorage.removeItem("redirectAfterLogin");

          navigate(redirect);
        } else {
          localStorage.removeItem("verifyUserId");
          localStorage.setItem("verifyUserId", data.userId);
          navigate("/verify-email");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <AuthCard
      title={isLogin ? <><span className="text-primary">QuickBlog</span> Login</> : <><span className="text-primary">QuickBlog</span> Register</>}
      subtitle={
        isLogin
          ? "Enter your credentials to access your account"
          : "Create your account to get started"
      }
    >
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <AuthField
            id="name_field"
            label="Full Name"
            type="text"
            placeholder="your full name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            wrapperClassName="mt-6"
          />
        )}

        <AuthField
          id="email_field"
          label="Email"
          type="email"
          placeholder="your email id"
          name="email"
          value={formData.email}
          onChange={handleChange}
          wrapperClassName={isLogin ? "mt-8" : "mt-5"}
        />

        <AuthField
          id="password_field"
          label="Password"
          type="password"
          placeholder="your password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          wrapperClassName={isLogin ? "mt-6" : "mt-5"}
        />

        {isLogin && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-primary text-sm font-medium hover:opacity-90 transition p-0"
            >
              Forgot Password?
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-md mt-8 font-medium hover:opacity-90 transition cursor-pointer"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="text-gray-500 text-center text-sm mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);

            setFormData({
              name: "",
              email: "",
              password: "",
            });
          }}
          className="ml-2 text-primary font-medium hover:opacity-90 transition"
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </AuthCard>
  );
};

export default Login;