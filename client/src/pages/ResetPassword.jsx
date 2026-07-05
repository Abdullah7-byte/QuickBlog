import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import AuthCard from "../components/AuthCard";
import AuthField from "../components/AuthField";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("resetEmail");

    if (!email) {
      toast.error("Please request a password reset first.");
      return navigate("/forgot-password");
    }

    try {
      const { data } = await api.post("/user/reset-password", {
        email,
        otp: formData.otp.trim(),
        newPassword: formData.newPassword,
      });

      if (data.success) {
        localStorage.removeItem("resetEmail");
        toast.success(data.message);
        navigate("/login");
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
      title="Reset Password"
      subtitle="Enter the OTP and your new password"
    >
      <form onSubmit={handleSubmit}>
        <AuthField
          id="otp_field"
          label="OTP"
          type="text"
          placeholder="Enter OTP"
          name="otp"
          maxLength={6}
          value={formData.otp}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              otp: e.target.value.replace(/\D/g, ""),
            }))
          }
          required
          wrapperClassName="mt-8"
        />

        <AuthField
          id="new_password_field"
          label="New Password"
          type="password"
          placeholder="New Password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          wrapperClassName="mt-6"
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-md mt-8 font-medium hover:opacity-90 transition cursor-pointer"
        >
          Reset Password
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

export default ResetPassword;