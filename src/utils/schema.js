const mongoose = require("mongoose");
require("mongoose-moment")(mongoose);
var moment = require("moment");
const { useContainer } = require("typeorm");

const reviewSchema = new mongoose.Schema([
  {
    adminId: String,
    pdfId: String,
    review: String,
    rating: String,
    Created_At: {
      type: String,
      default: moment().format("YYYY-MM-DD hh:mm:ss"),
    },
  },
]);

module.exports = {
  reviewSchema,
};
