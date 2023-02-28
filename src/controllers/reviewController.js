const reviewService = require("../services/reviewService");
// adminId는 추후 userId 등으로 교체 해야할 수 있음.
const addReview = async (req, res) => {
  try {
    const { adminId, pdfId, review, rating } = req.body;
    console.log(pdfId, review, rating);
    const addReview = await reviewService.addReview(
      adminId,
      pdfId,
      review,
      rating
    );
    return res.status(201).json({ addReview });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: "addReview error" });
  }
};

const getReview = async (req, res) => {
  try {
    const pdfId = req.params.pdfId;
    // console.log(pdfId, "================================");
    return res.status(200).json(await reviewService.getReview(pdfId));
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: "getReview error" });
  }
};

const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { title, updatedReview, updatedRating, adminId, pdfId } = req.body;
    const pdfs = await reviewService.updateReview(
      title,
      reviewId,
      updatedReview,
      updatedRating,
      adminId,
      pdfId
    );
    return res.status(200).json({ pdfs, message: "Updated" });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: "updateReivew error" });
  }
};

const deleteReview = async (req, res) => {
  try {
    // const userId = req.body.userId
    const adminId = req.body.adminId;
    const pdfId = req.body.pdfId;
    await reviewService.deleteReview(adminId, pdfId);
    return res.status(204).json({ message: "Deleted" });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: "deleteReview error" });
  }
};

module.exports = {
  addReview,
  getReview,
  updateReview,
  deleteReview,
};
