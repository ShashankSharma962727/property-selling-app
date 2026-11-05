const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const {
  genrateAccessToken,
  genrateRefreshToken,
} = require("../utils/genrateJwtToken");
const hashPass = require("../utils/hashPass");
const cloudinaryUpload = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/nodemailer");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Field are required!",
      });
    }

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "User Already registered! Please login.",
      });
    }

    const hashedPass = await hashPass(password);

    const user = await User.create({
      username,
      email,
      password: hashedPass,
    });

    return res.status(201).json({
      success: true,
      message: "User Created!",
      userid: user._id,
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered!",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Field are required!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found! Please register.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password! Please try again.",
      });
    }

    const accessToken = genrateAccessToken(
      user._id,
      user.username,
      user.email,
      "15m",
    );
    const refreshToken = genrateRefreshToken(
      user._id,
      user.username,
      user.email,
      "7d",
    );

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successfully!",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userid } = req.user;

    const user = await User.findById(userid).select("-password");

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const genrateNewAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh-token"];

    if (!refreshToken)
      return res
        .status(404)
        .json({ success: false, message: "Refresh token not found" });

    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decode.userid);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const newAccessToken = genrateAccessToken(
      user._id,
      user.username,
      user.email,
      "15m",
    );
    const newRefreshToken = genrateRefreshToken(
      user._id,
      user.username,
      user.email,
      "7d",
    );

    res.cookie("refresh-token", newRefreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(201).json({
      success: true,
      message: "Access Token created",
      newAccessToken,
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("refresh-token", {
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const sendVerifyOtp = async (req, res) => {
  try {
    const { userid } = req.user;

    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified!",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Mail verification OTP.",
      text: `Hello ${user.email} your Email verification otp is ${otp}, Thank you!`,
    });

    return res.status(200).json({
      success: true,
      message: "OTP send Successfully!",
    });
  } catch (error) {
    console.log("Send Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};
const verifyOtp = async (req, res) => {
  try {
    const {userid} = req.user;
    const {otp} = req.body;

    const user = await User.findById(userid);

    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found!"
      })
    }

    if(user.verifyOtp == "" || user.verifyOtp !== otp){
      return res.status(400).json({
        success: false,
        message: "Invalid otp!"
      })
    }

    if(user.verifyOtpExpireAt < Date.now()){
      return res.status(400).json({
        success: false,
        message: "Expire Otp!"
      })
    }

    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verification successfull!"
    })
  } catch (error) {
    console.log("Verify email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};
const sendResetOtp = async (req, res) => {};
const resetOtp = async (req, res) => {};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  genrateNewAccessToken,
  logout,
  sendVerifyOtp,
  verifyOtp,
  sendResetOtp,
  resetOtp,
};
