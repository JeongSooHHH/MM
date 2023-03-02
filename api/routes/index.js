const express = require("express");
const router = express.Router();

const uploadFileRouter = require("./uploadFileRouter");
const userRouter = require("./userRouter");

router.use("/files", uploadFileRouter.router);
router.use("/users", userRouter.router);

module.exports = router;
