import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import AuthCard from "../components/AuthCard";
import AuthField from "../components/AuthField";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/user/forgot-password", {
        email: email.trim(),
      });

      if (data.success) {
        localStorage.setItem("resetEmail", email.trim());
        toast.success(data.message);
        navigate("/reset-password");
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
      title="Forgot Password"
      subtitle="Enter your registered email to receive an OTP"
    >
      <form onSubmit={handleSubmit}>
        <AuthField
          id="email_field"
          label="Email"
          type="email"
          placeholder="your email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          wrapperClassName="mt-8"
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-md mt-8 font-medium hover:opacity-90 transition cursor-pointer"
        >
          Send OTP
        </button>
      </form>

      <button
        onClick={() => navigate("/login")}
        className="w-full mt-5 text-primary font-medium hover:opacity-90 transition"
      >
        Back to Login
      </button>
    </AuthCard>
  );
};

export default ForgotPassword;