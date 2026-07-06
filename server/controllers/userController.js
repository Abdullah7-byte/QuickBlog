import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import resend from "../config/resend.js";
import generateOtp from "../utils/generateOtp.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOtp();

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verifyOtp: otp,
      verifyOtpExpireAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    try {
      // Send Verification Email
      await resend.emails.send({
        from: process.env.SENDER_EMAIL || "onboarding@resend.dev",
        to: email,
        subject: "QuickBlog Email Verification",
        html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #333333;">
  <div style="text-align: center; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #f0f0f0;">
    <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #4F46E5;">
      <span style="color: #4F46E5;">Quick</span>Blog
    </h1>
  </div>
  <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-top: 0;">Verify Your Email Address</h2>
  <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
    Thank you for creating an account with QuickBlog. Please use the following One-Time Password (OTP) to verify your email address and complete your registration.
  </p>
  <div style="text-align: center; margin: 32px 0;">
    <div style="display: inline-block; padding: 12px 32px; font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #4F46E5; background-color: #EEF2F6; border-radius: 8px; border: 1px solid #E2E8F0;">
      ${otp}
    </div>
  </div>
  <p style="font-size: 14px; line-height: 1.5; color: #6b7280;">
    This code is valid for <strong>15 minutes</strong>. If you did not request this verification, you can safely ignore this email.
  </p>
  <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f0f0f0; text-align: center; font-size: 12px; color: #9ca3af;">
    &copy; ${new Date().getFullYear()} QuickBlog Team. All rights reserved.
  </div>
</div>`,
      });
    } catch (mailError) {
      await User.findByIdAndDelete(user._id);
      throw mailError;
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      userId: user._id,
    });
  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error);

    if (error.response) {
      console.error(error.response);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "User ID and OTP are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.verifyOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error);

    if (error.response) {
      console.error(error.response);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check Email Verification
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    // Compare Password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT Token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error);

    if (error.response) {
      console.error(error.response);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOtp();

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    await resend.emails.send({
      from: process.env.SENDER_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "QuickBlog Password Reset",
      html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #333333;">
  <div style="text-align: center; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #f0f0f0;">
    <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #4F46E5;">
      <span style="color: #4F46E5;">Quick</span>Blog
    </h1>
  </div>
  <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-top: 0;">Reset Your Password</h2>
  <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
    We received a request to reset the password for your QuickBlog account. Please use the following One-Time Password (OTP) to proceed with resetting your password.
  </p>
  <div style="text-align: center; margin: 32px 0;">
    <div style="display: inline-block; padding: 12px 32px; font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #4F46E5; background-color: #EEF2F6; border-radius: 8px; border: 1px solid #E2E8F0;">
      ${otp}
    </div>
  </div>
  <p style="font-size: 14px; line-height: 1.5; color: #6b7280; margin-bottom: 8px;">
    This code is valid for <strong>15 minutes</strong>.
  </p>
  <p style="font-size: 13px; line-height: 1.5; color: #ef4444; font-weight: 500;">
    Warning: If you did not request a password reset, please secure your account immediately or ignore this email.
  </p>
  <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f0f0f0; text-align: center; font-size: 12px; color: #9ca3af;">
    &copy; ${new Date().getFullYear()} QuickBlog Team. All rights reserved.
  </div>
</div>`,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully.",
    });
  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error);

    if (error.response) {
      console.error(error.response);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpireAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error);

    if (error.response) {
      console.error(error.response);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error);

    if (error.response) {
      console.error(error.response);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};