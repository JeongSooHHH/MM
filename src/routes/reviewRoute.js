const express = require("express");
const reviewController = require("../controllers/reviewController");
// const loginRequired  = require("../utils/auth");

const router = express.Router();

router.get("/get/:pdfId", reviewController.getReview);
router.post("/add", reviewController.addReview);
router.put("/update/:reviewId", reviewController.updateReview);
router.delete("/delete", reviewController.deleteReview);

module.exports = router;
