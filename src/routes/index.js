const express = require("express");

const reviewRoute = require("./reviewRoute");

const router = express.Router();

router.use("/test", reviewRoute);
module.exports = router;
