// const MongoClient = require("mongodb").MongoClient;
// const url = "mongodb://localhost:27017/test";

// let db;

// MongoClient.connect(url, function (err, client) {
//   if (err) throw err;
//   db = client.db("test");
// });

// const collection = db.collection("test");

// class UserDAO {
//   create(data, callback) {
//     collection.insertOne(data, (err, result) => {
//       if (err) return callback(err, null);
//       callback(null, result.ops[0]);
//     });
//   }

//   all(callback) {
//     collection.find().toArray((err, docs) => {
//       if (err) return callback(err, null);
//       callback(null, docs);
//     });
//   }

//   findById(id, callback) {
//     const query = { _id: ObjectId(id) };
//     collection.findOne(query, (err, doc) => {
//       if (err) return callback(err, null);
//       callback(null, doc);
//     });
//   }

//   update(data, callback) {
//     const query = { _id: ObjectId(data._id) };
//     delete data._id;
//     collection.replaceOne(query, data, (err, result) => {
//       if (err) return callback(err, null);
//       callback(null, result);
//     });
//   }

//   delete(id, callback) {
//     const query = { _id: ObjectId(id) };
//     collection.deleteOne(query, (err, result) => {
//       if (err) return callback(err, null);
//       callback(null, result);
//     });
//   }
// }

// module.exports = new UserDAO();
//=================================================================
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
