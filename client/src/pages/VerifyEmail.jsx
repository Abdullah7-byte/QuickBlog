import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import AuthCard from "../components/AuthCard";
import AuthField from "../components/AuthField";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("verifyUserId");
      if (!userId) {
        toast.error("Please register first.");
        return navigate("/login");
      }

      const { data } = await api.post("/user/verify-email", {
        userId,
        otp: otp.trim(),
      });

      if (data.success) {
        setOtp("");
        localStorage.removeItem("verifyUserId");
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthCard
      title="Verify Email"
      subtitle="Enter the OTP sent to your email"
    >
      <form onSubmit={handleSubmit}>
        <AuthField
          id="otp_field"
          label="OTP"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          required
          wrapperClassName="mt-8"
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-md mt-8 font-medium hover:opacity-90 transition cursor-pointer"
        >
          Verify
        </button>
      </form>
    </AuthCard>
  );
};

export default VerifyEmail;
