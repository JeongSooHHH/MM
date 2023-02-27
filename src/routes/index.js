const express = require("express");

const reviewRoute = require("./reviewRoute");

const router = express.Router();

router.use("/reviews", reviewRoute);
module.exports = router;
