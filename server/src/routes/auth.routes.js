const express = require("express");
const { registerUser, loginUser, getProfile, genrateNewAccessToken, logout } = require("../controllers/auth.controllers");
const upload = require("../middlewares/multer");
const checkAccessToken = require("../middlewares/checkAccessToken");
const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/profile",checkAccessToken, getProfile);
authRouter.get("/refresh-token", genrateNewAccessToken);
authRouter.get("/logout",checkAccessToken, logout);

module.exports = authRouter;