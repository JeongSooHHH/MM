const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017/mydb");
const database = client.db("mydb");
const fileUpload = database.collection("fileUpload");

const uploadFileGoogle = async (userId, name, mimetype, date, size) => {
  return fileUpload.insertMany([
    {
      userId: userId,
      fileName: name,
      mimeType: mimetype,
      date: date,
      size: size + "MB",
    },
  ]);
};

const duplicateCheck = async (userId, name) => {
  return fileUpload.findOne({ fileName: name }, { userId: userId });
};

const checkUploadList = async (userId) => {
  return await fileUpload.find({ userId: userId }).toArray();
};

module.exports = { uploadFileGoogle, duplicateCheck, checkUploadList };
