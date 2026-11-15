const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  genrateNewAccessToken,
  logout,
  sendVerifyOtp,
  verifyOtp,
  sendResetOtp,
  resetOtp,
  editUser
} = require("../controllers/auth.controllers");
const upload = require("../middlewares/multer");
const checkAccessToken = require("../middlewares/checkAccessToken");
const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/profile", checkAccessToken, getProfile);
authRouter.get("/refresh-token", genrateNewAccessToken);
authRouter.get("/logout", checkAccessToken, logout);
authRouter.post("/send-verify-otp", checkAccessToken, sendVerifyOtp);
authRouter.post("/verify-email", checkAccessToken, verifyOtp);
authRouter.post("/send-reset-otp", checkAccessToken, sendResetOtp);
authRouter.post("/reset-pass", checkAccessToken, resetOtp);
authRouter.put("/edit-user", checkAccessToken, editUser);

module.exports = authRouter;