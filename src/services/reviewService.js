const reviewDao = require("../models/reviewDao");

const addReview = async (adminId, pdfId, review, rating) => {
  return await reviewDao.addReview(adminId, pdfId, review, rating);
};

const getReview = async (pdfId) => {
  // console.log(pdfId, "===222");
  return await reviewDao.getReview(pdfId);
};

const updateReview = async (adminId, pdfId, updatedReview, updatedRating) => {
  return await reviewDao.updateReview(
    adminId,
    pdfId,
    updatedReview,
    updatedRating
  );
};

const deleteReview = async (adminId, pdfId) => {
  return await reviewDao.deleteReview(adminId, pdfId);
};

module.exports = {
  addReview,
  getReview,
  updateReview,
  deleteReview,
};
