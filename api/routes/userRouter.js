const express = require("express");
const router = express.Router();
const naverController = require("../controllers/naverController");
const userController = require("../controllers/userController");

router.post("/naver/login", naverController.naverLogin);
router.post("/signup", userController.userSignUp);
router.post("/signin", userController.userSignIn);

module.exports = { router };
