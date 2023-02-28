// const { MongoClient } = require("mongodb");
// const { reviewSchema } = require("../utils/schema");

// const uri =
//   "mongodb+srv://space2577:ghkdwjdtn@csm.jifgqtn.mongodb.net/mathMedic";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const databaseName = "mathMedic";
// const collectionName = "reviews";

// client.connect(async (err) => {
//   if (err) console.error(err);
//   console.log("Connected to MongoDB");

//   const database = client.db(databaseName);
//   const collection = database.collection(collectionName);

//   const addReview = async (adminId, pdfId, review, rating) => {
//     try {
//       const reviews = await collection.insertOne({
//         adminId: adminId,
//         pdfId: pdfId,
//         review: review,
//         rating: rating,
//       });
//       return reviews.ops[0];
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const getReview = async (pdfId) => {
//     console.log(pdfId, "====5555");
//     try {
//       const getReviewsBypdfId = await collection
//         .findOne({
//           pdfId: pdfId,
//           // adminId: adminId,
//         })
//         .toArray();
//       return getReviewsBypdfId;
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const updateReview = async (adminId, pdfId, updatedReview, updatedRating) => {
//     try {
//       const updatedReviews = await collection.findOneAndUpdate(
//         {
//           adminId: adminId,
//           pdfId: pdfId,
//         },
//         { $set: { review: updatedReview, rating: updatedRating } },
//         { returnOriginal: false }
//       );
//       return updatedReviews.value;
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const deleteReview = async (adminId, pdfId) => {
//     try {
//       const deleteReview = await collection.findOneAndDelete({
//         adminId: adminId,
//         pdfId: pdfId,
//       });
//       return deleteReview.value;
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   module.exports = {
//     addReview,
//     getReview,
//     updateReview,
//     deleteReview,
//   };
// });

//상단 네이티브=================================================================하단 몽구스
const mongoose = require("mongoose");
const { get } = require("request");

const { useContainer } = require("typeorm");
const { reviewSchema } = require("../utils/schema");

const Review = new mongoose.model("Review", reviewSchema);

const addReview = async (adminId, pdfId, review, rating) => {
  try {
    const reviews = await Review.create({
      adminId: adminId,
      pdfId: pdfId,
      review: review,
      rating: rating,
    });
    return reviews;
  } catch (err) {
    console.log(err);
  }
};

const getReview = async (pdfId) => {
  console.log(pdfId, "-==555");
  try {
    const getReviewsBypdfId = await Review.find({
      pdfId: pdfId,
      // adminId: adminId,
    });
    return getReviewsBypdfId;
  } catch (err) {
    console.log(err);
  }
};

const updateReview = async (adminId, pdfId, updatedReview, updatedRating) => {
  try {
    const updatedReviews = await Review.findByIdAndUpdate({
      adminId: adminId,
      pdfId: pdfId,
      updatedReview: updatedReview,
      updatedRating: updatedRating,
    });
    return updatedReviews;
  } catch (err) {
    console.log(err);
  }
};

const deleteReview = async (adminId, pdfId) => {
  try {
    const deleteReview = await Review.findOneAndDelete({
      adminId: adminId,
      pdfId: pdfId,
    });

    //   console.log("Deleted :", deleteReview)
    return deleteReview;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  addReview,
  getReview,
  updateReview,
  deleteReview,
};
